import { Database } from "bun:sqlite";
import { env } from "../env";
import logger from "../structures/Logger";
import { detectDatabaseType } from "./detectDatabaseType";
import { PostgresProvider, SQLiteProvider } from "./provider";
import * as pgSchema from "./schemas";
import * as sqliteSchema from "./schemas.sqlite";
import { DatabaseType, type IDatabaseProvider } from "./types";

/**
 * Creates and returns a database provider based on the DATABASE_URL
 */
export async function createDatabaseProvider(): Promise<IDatabaseProvider> {
	const dbType = detectDatabaseType(env.DATABASE_URL);

	switch (dbType) {
		case DatabaseType.Postgres: {
			const { drizzle } = await import("drizzle-orm/node-postgres");
			const { Pool } = await import("pg");

			const pool = new Pool({ connectionString: env.DATABASE_URL });
			const db = drizzle(pool, { schema: pgSchema });

			logger.success("[DB] Connected to PostgreSQL");
			return new PostgresProvider(dbType, db, pgSchema);
		}

		case DatabaseType.PGLite: {
			const { drizzle } = await import("drizzle-orm/pglite");
			const dataDir = env.DATABASE_URL?.replace("file:", "") || "./lavamusic-pgdata";

			const { PGlite } = await import("@electric-sql/pglite");

			const client: any = new PGlite(dataDir);

			const db = drizzle(client, { schema: pgSchema });

			logger.success("[DB] Connected to PGLite");
			return new PostgresProvider(dbType, db, pgSchema);
		}

		case DatabaseType.SQLite: {
			const { drizzle } = await import("drizzle-orm/bun-sqlite");

			let path = env.DATABASE_URL?.replace("file:", "") || "./lavamusic.db";
			if (path.startsWith("sqlite:")) {
				path = path.replace("sqlite:", "");
			}

			const sqlite = new Database(path);
			const db = drizzle(sqlite, { schema: sqliteSchema });

			logger.success(`[DB] Connected to SQLite at ${path}`);
			return new SQLiteProvider(dbType, db, sqliteSchema);
		}

		default: {
			throw new Error(`Unsupported database type: ${dbType}`);
		}
	}
}

/**
 * Singleton instance holder (caches the creation promise so concurrent
 * callers share a single provider instead of each building their own)
 */
let _providerPromise: Promise<IDatabaseProvider> | null = null;

/**
 * Gets the database provider instance (creates it if not exists)
 */
export async function getDatabase(): Promise<IDatabaseProvider> {
	if (!_providerPromise) {
		_providerPromise = createDatabaseProvider().catch((error) => {
			// Allow a later call to retry after a failed initialization
			_providerPromise = null;
			throw error;
		});
	}
	return _providerPromise;
}

/**
 * Resets the database provider (useful for testing)
 */
export function resetDatabase(): void {
	_providerPromise = null;
}
