import { detectDatabaseType } from "../src/database/detectDatabaseType";
import * as postgresSchema from "../src/database/schemas";
import * as sqliteSchema from "../src/database/schemas.sqlite";
import { DatabaseType } from "../src/database/types";
import { env } from "../src/env";

const MIGRATIONS = {
	postgres: "./drizzle/postgres",
	sqlite: "./drizzle/sqlite",
} as const;

async function migratePostgres() {
	const [{ drizzle }, { Pool }, { migrate }] = await Promise.all([
		import("drizzle-orm/node-postgres"),
		import("pg"),
		import("drizzle-orm/node-postgres/migrator"),
	]);

	const pool = new Pool({
		connectionString: env.DATABASE_URL,
	});

	try {
		const db = drizzle(pool, {
			schema: postgresSchema,
		});

		await migrate(db, {
			migrationsFolder: MIGRATIONS.postgres,
		});

		console.log("🐘 PostgreSQL database is up to date");
	} finally {
		await pool.end();
	}
}

async function migratePglite() {
	const [{ drizzle }, { PGlite }, { migrate }] = await Promise.all([
		import("drizzle-orm/pglite"),
		import("@electric-sql/pglite"),
		import("drizzle-orm/pglite/migrator"),
	]);

	const dataDir = env.DATABASE_URL?.replace(/^file:/, "") || "./lavamusic-pgdata";

	const client = new PGlite(dataDir);

	try {
		await client.waitReady;

		const db = drizzle(client, {
			schema: postgresSchema,
		});

		await migrate(db, {
			migrationsFolder: MIGRATIONS.postgres,
		});

		console.log("🐘 PGLite database is up to date");
	} finally {
		await client.close();
	}
}

async function migrateSqlite() {
	const [{ Database }, { drizzle }, { migrate }] = await Promise.all([
		import("bun:sqlite"),
		import("drizzle-orm/bun-sqlite"),
		import("drizzle-orm/bun-sqlite/migrator"),
	]);

	let path = env.DATABASE_URL || "./lavamusic.db";

	path = path.replace(/^sqlite:/, "").replace(/^file:/, "");

	const sqlite = new Database(path);

	try {
		const db = drizzle(sqlite, {
			schema: sqliteSchema,
		});

		await migrate(db, {
			migrationsFolder: MIGRATIONS.sqlite,
		});

		console.log("📦 SQLite database is up to date");
	} finally {
		sqlite.close();
	}
}

async function main() {
	const databaseType = detectDatabaseType(env.DATABASE_URL);

	switch (databaseType) {
		case DatabaseType.Postgres:
			await migratePostgres();
			break;

		case DatabaseType.PGLite:
			await migratePglite();
			break;

		case DatabaseType.SQLite:
			await migrateSqlite();
			break;

		default:
			throw new Error(`Unsupported database type: ${databaseType}`);
	}
}

await main();
