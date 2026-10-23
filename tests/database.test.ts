/**
 * Database tests
 *
 * Run from the project root, because the migrations folders are relative
 * to the working directory (./drizzle/postgres and ./drizzle/sqlite):
 *
 *   bun test tests/database.test.ts
 *
 * SQLite and PGlite always run, using a temporary directory that is deleted at the end.
 * PostgreSQL only runs when TEST_POSTGRES_URL is set.
 * Use a throwaway database: the tests apply migrations and leave rows behind (with random ids,
 * so they never collide with each other).
 *
 *   TEST_POSTGRES_URL=postgres://user:pass@localhost:5432/lavamusic_test bun test
 */
import { afterAll, beforeAll, describe, expect, setDefaultTimeout, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { type Connection, connect } from "../src/database/connection";
import { detectDatabaseType } from "../src/database/detectDatabaseType";
import { PostgresProvider, SQLiteProvider } from "../src/database/provider";
import { DatabaseType, type IDatabaseProvider, type Stay } from "../src/database/types";
import { env } from "../src/env";

// Wait a while when start on the first run
setDefaultTimeout(30_000);

/** Helpers */

const REQUIRED_TABLES = ["guild", "setup", "stay", "dj", "role", "playlist"];

const PG_TABLES = sql`select table_name as name from information_schema.tables where table_schema = 'public'`;

let tmpDir: string;

beforeAll(async () => {
	tmpDir = await mkdtemp(join(tmpdir(), "lavamusic-db-test-"));
});

afterAll(async () => {
	await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
});

/** Lists lowercased table names so the check works whatever the casing is. */
async function listTables(connection: Connection): Promise<string[]> {
	let rows: { name: string }[];

	switch (connection.dbType) {
		case DatabaseType.SQLite:
			rows = connection.db.all<{ name: string }>(
				sql`select name from sqlite_master where type = 'table'`,
			);
			break;
		case DatabaseType.Postgres:
			rows = (await connection.db.execute(PG_TABLES)).rows as { name: string }[];
			break;
		case DatabaseType.PGLite:
			rows = (await connection.db.execute(PG_TABLES)).rows as { name: string }[];
			break;
	}

	return rows.map((row) => row.name.toLowerCase());
}

/** Same selection logic as factory.ts, but for explicit connection. */
function createProvider(connection: Connection): IDatabaseProvider {
	return connection.dbType === DatabaseType.SQLite
		? new SQLiteProvider(connection.dbType, connection.db, connection.schema)
		: new PostgresProvider(connection.dbType, connection.db, connection.schema);
}

const guildId = () => `test-guild-${randomUUID()}`;
const userId = () => `test-user-${randomUUID()}`;

/** Database Type */

describe("Database Type", () => {
	const cases: [string | undefined, DatabaseType][] = [
		[undefined, DatabaseType.PGLite],
		["", DatabaseType.PGLite],

		["postgres://user:pass@localhost:5432/db", DatabaseType.Postgres],
		["postgresql://user:pass@localhost:5432/db", DatabaseType.Postgres],
		["POSTGRES://user:pass@localhost:5432/db", DatabaseType.Postgres],

		["./lavamusic.db", DatabaseType.SQLite],
		["./lavamusic.sqlite", DatabaseType.SQLite],
		["./lavamusic.sqlite3", DatabaseType.SQLite],
		["./lavamusic.db?mode=ro", DatabaseType.SQLite],
		["sqlite:./lavamusic", DatabaseType.SQLite],
		["sqlite://./lavamusic", DatabaseType.SQLite],
		["file:./lavamusic.db", DatabaseType.SQLite],
		["file:./lavamusic?mode=ro", DatabaseType.SQLite],

		["file:./lavamusic-pgdata", DatabaseType.PGLite],
		["./lavamusic-pgdata", DatabaseType.PGLite],
	];

	for (const [url, expected] of cases) {
		test(`${JSON.stringify(url)} -> ${expected}`, () => {
			expect(detectDatabaseType(url)).toBe(expected);
		});
	}
});

/** URL handling (toPath) */

describe("Connection URL handling", () => {
	const sqliteVariants: [string, (path: string) => string][] = [
		["plain path", (p) => p],
		["sqlite: prefix", (p) => `sqlite:${p}`],
		["sqlite:// prefix", (p) => `sqlite://${p}`],
		["file: prefix", (p) => `file:${p}`],
		["file: prefix with query string", (p) => `file:${p}?mode=rwc`],
		["nested sqlite:file: prefix", (p) => `sqlite:file:${p}`],
	];

	sqliteVariants.forEach(([label, build], index) => {
		test(`SQLite: ${label}`, async () => {
			const file = join(tmpDir, `variant-${index}.db`);
			const conn = await connect(build(file));

			try {
				expect(conn.dbType).toBe(DatabaseType.SQLite);
				await conn.migrate();
				// The file must be created exactly where we asked,
				// with no prefix or query string leaking into the name
				expect(existsSync(file)).toBe(true);
			} finally {
				await conn.close();
			}
		});
	});

	const pgliteVariants: [string, (path: string) => string][] = [
		["plain directory", (p) => p],
		["file: prefix", (p) => `file:${p}`],
	];

	pgliteVariants.forEach(([label, build], index) => {
		test(`PGlite: ${label}`, async () => {
			const dir = join(tmpDir, `pglite-variant-${index}`);
			const conn = await connect(build(dir));

			try {
				expect(conn.dbType).toBe(DatabaseType.PGLite);
				await conn.migrate();
				expect(existsSync(dir)).toBe(true);
			} finally {
				await conn.close();
			}
		});
	});
});


/* Migrations and provider for all database type */

type Target = {
	label: string;
	type: DatabaseType;
	enabled: boolean;
	url: () => string;
};

const targets: Target[] = [
	{
		label: "SQLite",
		type: DatabaseType.SQLite,
		enabled: true,
		url: () => join(tmpDir, "main.db"),
	},
	{
		label: "PGlite",
		type: DatabaseType.PGLite,
		enabled: true,
		url: () => join(tmpDir, "main-pgdata"),
	},
	{
		label: "PostgreSQL",
		type: DatabaseType.Postgres,
		enabled: Boolean(process.env.TEST_POSTGRES_URL),
		url: () => process.env.TEST_POSTGRES_URL ?? "",
	},
];

for (const target of targets) {
	describe.skipIf(!target.enabled)(target.label, () => {
		let connection: Connection;
		let provider: IDatabaseProvider;

		beforeAll(async () => {
			connection = await connect(target.url());
			await connection.migrate();
			provider = createProvider(connection);
		});

		afterAll(async () => {
			await connection?.close();
		});

		/* Migrations */

		describe("Migrations", () => {
			test("Connects using the expected driver", () => {
				expect(connection.dbType).toBe(target.type);
			});

			test("Create every table used by provider", async () => {
				const tables = await listTables(connection);
				for (const table of REQUIRED_TABLES) {
					expect(tables).toContain(table);
				}
			});

			test("Running them again is a no-op", async () => {
				await expect(connection.migrate()).resolves.toBeUndefined();
			});
		});

		/* Guilds */

		describe("Guilds", () => {
			test("Get creates the guild with default values", async () => {
				const id = guildId();
				const guild = await provider.guilds.get(id);

				expect(guild.guildId).toBe(id);
				expect(guild.prefix).toBe(env.PREFIX);
				expect(guild.language).toBe(env.DEFAULT_LANGUAGE);
			});

			test("Concurrent get calls do not fail or duplicate guild", async () => {
				const id = guildId();
				const results = await Promise.all([
					provider.guilds.get(id),
					provider.guilds.get(id),
					provider.guilds.get(id),
					provider.guilds.get(id),
				]);

				for (const guild of results) {
					expect(guild.guildId).toBe(id);
				}
			});

			test("Prefix", async () => {
				const id = guildId();
				await provider.guilds.setPrefix(id, "?");
				expect(await provider.guilds.getPrefix(id)).toBe("?");
			});

			test("Language", async () => {
				const id = guildId();
				await provider.guilds.updateLanguage(id, "pt-BR");
				expect(await provider.guilds.getLanguage(id)).toBe("pt-BR");
			});

			test("Default Volume", async () => {
				const id = guildId();
				await provider.guilds.setDefaultVolume(id, 80);
				expect(await provider.guilds.getDefaultVolume(id)).toBe(80);
			});
		});

		/* Setups */

		describe("Setups", () => {
			test("Set, update, get and delete", async () => {
				const id = guildId();
				expect(await provider.setups.get(id)).toBeNull();

				await provider.setups.set(id, "text-1", "message-1");
				expect(await provider.setups.get(id)).toMatchObject({
					guildId: id,
					textId: "text-1",
					messageId: "message-1",
				});

				// Second call must update the same row (upsert)
				await provider.setups.set(id, "text-2", "message-2");
				expect(await provider.setups.get(id)).toMatchObject({
					textId: "text-2",
					messageId: "message-2",
				});

				await provider.setups.delete(id);
				expect(await provider.setups.get(id)).toBeNull();
			});
		});

		/* Stays */

		describe("Stays", () => {
			test("Set, update, get and delete", async () => {
				const id = guildId();
				expect(await provider.stays.get(id)).toBeNull();

				await provider.stays.set(id, "text-1", "voice-1");
				expect(await provider.stays.get(id)).toMatchObject({
					guildId: id,
					textId: "text-1",
					voiceId: "voice-1",
				});

				await provider.stays.set(id, "text-2", "voice-2");
				expect(await provider.stays.get(id)).toMatchObject({
					textId: "text-2",
					voiceId: "voice-2",
				});

				await provider.stays.delete(id);
				expect(await provider.stays.get(id)).toBeNull();
			});

			test("Get without a guild returns every stay", async () => {
				const id = guildId();
				await provider.stays.set(id, "text-1", "voice-1");

				const all = await provider.stays.get();
				expect(Array.isArray(all)).toBe(true);
				expect((all as Stay[]).some((stay) => stay.guildId === id)).toBe(true);

				await provider.stays.delete(id);
			});
		});

		/* DJs */

		describe("DJs", () => {
			test("setMode toggles the mode", async () => {
				const id = guildId();
				expect(await provider.djs.get(id)).toBeNull();

				await provider.djs.setMode(id, true);
				expect(Boolean((await provider.djs.get(id))?.mode)).toBe(true);

				await provider.djs.setMode(id, false);
				expect(Boolean((await provider.djs.get(id))?.mode)).toBe(false);
			});
		});

		/* Roles */

		describe("Roles", () => {
			test("Add, remove and clear", async () => {
				const id = guildId();
				await provider.roles.add(id, "role-1");
				await provider.roles.add(id, "role-2");

				const ids = (await provider.roles.getAll(id)).map((role) => role.roleId).sort();
				expect(ids).toEqual(["role-1", "role-2"]);

				await provider.roles.remove(id, "role-1");
				expect((await provider.roles.getAll(id)).map((role) => role.roleId)).toEqual(["role-2"]);

				await provider.roles.clear(id);
				expect(await provider.roles.getAll(id)).toEqual([]);
			});

			// Fails if the role table has no unique constraint on (guildId, roleId),
			// because onConflictDoNothing() only works with one.
			test("Adding the same role twice does not duplicate it", async () => {
				const id = guildId();
				await provider.roles.add(id, "role-1");
				await provider.roles.add(id, "role-1");

				expect(await provider.roles.getAll(id)).toHaveLength(1);
			});
		});

		/* Playlists */

		describe("Playlists", () => {
			test("Create, add, remove, clear and delete tracks", async () => {
				const user = userId();

				await provider.playlists.create(user, "mix");
				expect(await provider.playlists.getTracks(user, "mix")).toEqual([]);

				await provider.playlists.addTracks(user, "mix", ["a", "b"]);
				await provider.playlists.addTracks(user, "mix", ["c"]);
				expect(await provider.playlists.getTracks(user, "mix")).toEqual(["a", "b", "c"]);

				await provider.playlists.removeTrack(user, "mix", "b");
				expect(await provider.playlists.getTracks(user, "mix")).toEqual(["a", "c"]);

				await provider.playlists.clearTracks(user, "mix");
				expect(await provider.playlists.getTracks(user, "mix")).toEqual([]);

				await provider.playlists.delete(user, "mix");
				expect(await provider.playlists.get(user, "mix")).toBeNull();
				expect(await provider.playlists.getTracks(user, "mix")).toBeNull();
			});

			test("createWithTracks stores the given tracks", async () => {
				const user = userId();
				await provider.playlists.createWithTracks(user, "mix", ["a", "b"]);

				expect(await provider.playlists.getTracks(user, "mix")).toEqual(["a", "b"]);
			});

			test("addTracks creates the playlist when it does not exist", async () => {
				const user = userId();
				await provider.playlists.addTracks(user, "new", ["a"]);

				expect(await provider.playlists.getTracks(user, "new")).toEqual(["a"]);
			});

			test("getUserPlaylists only returns the user's playlists", async () => {
				const user = userId();
				const other = userId();
				await provider.playlists.create(user, "one");
				await provider.playlists.create(user, "two");
				await provider.playlists.create(other, "three");

				const names = (await provider.playlists.getUserPlaylists(user)).map((p) => p.name).sort();
				expect(names).toEqual(["one", "two"]);
			});

			// Fails if the playlist table has no unique constraint on (userId, name)
			test("Creating the same playlist twice does not duplicate it", async () => {
				const user = userId();
				await provider.playlists.create(user, "mix");
				await provider.playlists.create(user, "mix");

				expect(await provider.playlists.getUserPlaylists(user)).toHaveLength(1);
			});
		});
	});
}