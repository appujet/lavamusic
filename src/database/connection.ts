import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { env } from "../env";
import { detectDatabaseType } from "./detectDatabaseType";
import * as pgSchema from "./schemas";
import * as sqliteSchema from "./schemas.sqlite";
import { DatabaseType } from "./types";

const MIGRATIONS = {
	postgres: "./drizzle/postgres",
	sqlite: "./drizzle/sqlite",
} as const;

const DEFAULTS = {
	pglite: "./lavamusic-pgdata",
	sqlite: "./lavamusic.db",
} as const;

/** Remove sqlite:, sqlite://, file:, file:// and query string. */
function toPath(url: string | undefined, fallback: string): string {
	const path = url?.replace(/^(?:(?:sqlite|file):(?:\/\/)?)+/i, "").split("?")[0];
	return path || fallback;
}

type Base = {
	label: string;
	migrate: () => Promise<void>;
	close: () => Promise<void>;
};

export type Connection =
	| (Base & {
			dbType: DatabaseType.Postgres;
			db: NodePgDatabase<typeof pgSchema>;
			schema: typeof pgSchema;
	  })
	| (Base & {
			dbType: DatabaseType.PGLite;
			db: PgliteDatabase<typeof pgSchema>;
			schema: typeof pgSchema;
	  })
	| (Base & {
			dbType: DatabaseType.SQLite;
			db: BunSQLiteDatabase<typeof sqliteSchema>;
			schema: typeof sqliteSchema;
	  });

export async function connect(url = env.DATABASE_URL): Promise<Connection> {
	const dbType = detectDatabaseType(url);

	switch (dbType) {
		case DatabaseType.Postgres: {
			const [{ drizzle }, { Pool }, { migrate }] = await Promise.all([
				import("drizzle-orm/node-postgres"),
				import("pg"),
				import("drizzle-orm/node-postgres/migrator"),
			]);
			const pool = new Pool({ connectionString: url });
			const db = drizzle(pool, { schema: pgSchema });

			return {
				dbType,
				label: "PostgreSQL",
				db,
				schema: pgSchema,
				migrate: () => migrate(db, { migrationsFolder: MIGRATIONS.postgres }),
				close: () => pool.end(),
			};
		}

		case DatabaseType.PGLite: {
			const [{ drizzle }, { PGlite }, { migrate }] = await Promise.all([
				import("drizzle-orm/pglite"),
				import("@electric-sql/pglite"),
				import("drizzle-orm/pglite/migrator"),
			]);
			const client = new PGlite(toPath(url, DEFAULTS.pglite));

			await client.waitReady;
			const db = drizzle(client, { schema: pgSchema });

			return {
				dbType,
				label: "PGlite",
				db,
				schema: pgSchema,
				migrate: () => migrate(db, { migrationsFolder: MIGRATIONS.postgres }),
				close: () => client.close(),
			};
		}

		case DatabaseType.SQLite: {
			const [{ Database }, { drizzle }, { migrate }] = await Promise.all([
				import("bun:sqlite"),
				import("drizzle-orm/bun-sqlite"),
				import("drizzle-orm/bun-sqlite/migrator"),
			]);
			const sqlite = new Database(toPath(url, DEFAULTS.sqlite));
			const db = drizzle(sqlite, { schema: sqliteSchema });

			return {
				dbType,
				label: "SQLite",
				db,
				schema: sqliteSchema,
				migrate: async () => migrate(db, { migrationsFolder: MIGRATIONS.sqlite }),
				close: async () => sqlite.close(),
			};
		}

		default:
			throw new Error(`Unsupported database type: ${dbType}`);
	}
}
