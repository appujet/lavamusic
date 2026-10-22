export { detectDatabaseType } from "./detectDatabaseType";
// Re-export factory functions
export { closeDatabase, getDatabase } from "./factory";
// Re-export providers
export { PostgresProvider, SQLiteProvider } from "./provider";
// Re-export schemas
export * as pgSchema from "./schemas";
export * as sqliteSchema from "./schemas.sqlite";
// Re-export all types
export * from "./types";
