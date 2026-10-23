import { connect } from "../src/database/connection";

let connection: Awaited<ReturnType<typeof connect>> | undefined;

try {
	connection = await connect();
	await connection.migrate();
	console.log(`✅ ${connection.label} database is up to date`);
} catch (error) {
	console.error("❌ Migration failed:", error);
	process.exitCode = 1;
} finally {
	await connection?.close();
}
