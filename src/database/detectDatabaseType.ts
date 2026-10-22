import { DatabaseType } from "./types";

/**
 * Detects the database type from the connection URL
 */
export function detectDatabaseType(url?: string): DatabaseType {
	if (!url) return DatabaseType.PGLite;

	if (/^postgres(ql)?:\/\//i.test(url)) return DatabaseType.Postgres;

	const isSqlite =
		/^sqlite:/i.test(url) ||
		/\.(db|sqlite3?)(\?.*)?$/i.test(url) ||
		(url.startsWith("file:") && url.includes("?"));

	// If it has query parameters (e.g., ?mode=ro), it is a valid SQLite URI
	// If it has a file extension, it is likely a SQLite file
	return isSqlite ? DatabaseType.SQLite : DatabaseType.PGLite;
}
