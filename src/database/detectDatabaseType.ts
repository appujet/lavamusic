import { DatabaseType } from "./types";

/**
 * Detects the database type from the connection URL
 */
export function detectDatabaseType(url?: string): DatabaseType {
	if (!url) return DatabaseType.PGLite;

	if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
		return DatabaseType.Postgres;
	}

	if (
		url.startsWith("sqlite:") ||
		url.endsWith(".db") ||
		url.endsWith(".sqlite") ||
		url.endsWith(".sqlite3")
	) {
		return DatabaseType.SQLite;
	}

	if (url.startsWith("file:")) {
		// If it has query parameters (e.g., ?mode=ro), it is a valid SQLite URI
		if (url.includes("?")) return DatabaseType.SQLite;

		// If it has a file extension, it is likely a SQLite file
		if (/\.(db|sqlite3?)$/i.test(url)) return DatabaseType.SQLite;

		// If it starts with 'file:' but has no extension or query, assume it's a PGLite directory
		return DatabaseType.PGLite;
	}

	return DatabaseType.PGLite;
}