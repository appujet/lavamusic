import logger from "../structures/Logger";
import { type Connection, connect } from "./connection";
import { PostgresProvider, SQLiteProvider } from "./provider";
import { DatabaseType, type IDatabaseProvider } from "./types";

/**
 * Creates and returns a database provider based on the DATABASE_URL
 */
function createDatabaseProvider(connection: Connection): IDatabaseProvider {
	return connection.dbType === DatabaseType.SQLite
		? new SQLiteProvider(connection.dbType, connection.db, connection.schema)
		: new PostgresProvider(connection.dbType, connection.db, connection.schema);
}

/**
 * Singleton instance holder (caches the creation promise so concurrent
 * callers share a single provider instead of each building their own)
 */
let _connection: Connection | null = null;
let _providerPromise: Promise<IDatabaseProvider> | null = null;

/**
 * Gets the database provider instance (creates it if not exists)
 */
export async function getDatabase(): Promise<IDatabaseProvider> {
	_providerPromise ??= (async () => {
		const connection = await connect();
		_connection = connection;
		logger.success(`[DB] Connected to ${connection.label}`);
		return createDatabaseProvider(connection);
	})().catch(async (error) => {
		// Allow a later call to retry after a failed initialization
		const connection = _connection;
		_providerPromise = null;
		_connection = null;
		await connection?.close().catch(() => {});
		throw error;
	});

	return _providerPromise;
}

/**
 * Closes the connection and resets the cached provider
 */
export async function closeDatabase(): Promise<void> {
	const connection = _connection;
	_connection = null;
	_providerPromise = null;
	await connection?.close();
}
