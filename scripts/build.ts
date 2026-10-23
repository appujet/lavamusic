import { rm } from "node:fs/promises";
import { join } from "node:path";
import type { BuildConfig, BunPlugin } from "bun";

console.time("✅ Build complete");

const clean = async () => {
	console.log("🧹 Cleaning previous build...");
	await rm(join(import.meta.dir, "..", "dist"), { recursive: true, force: true });
};

await clean();

// Find all .ts files (except type definitions and tests)
const glob = new Bun.Glob("**/*.ts");
const entrypoints: string[] = [];

console.log("🔍 Scanning source files...");
for await (const file of glob.scan({ cwd: "./src" })) {
	if (!file.endsWith(".d.ts") && !file.endsWith(".test.ts")) {
		entrypoints.push(`./src/${file}`);
	}
}

const stubOptionalDeps: BunPlugin = {
	name: "stub-optional-deps",
	setup(build) {
		build.onResolve({ filter: /^(eris|discord-rose|discord\.js-selfbot-v13)$/ }, (args) => ({
			path: args.path,
			namespace: "stub-module",
		}));
		build.onLoad({ filter: /.*/, namespace: "stub-module" }, () => ({
			contents: "module.exports = {};",
			loader: "js",
		}));
	},
};

/**
 * Build configuration
 */
const buildConfig: BuildConfig = {
	entrypoints: entrypoints,
	outdir: "./dist",
	root: "./src",
	minify: true,
	target: "bun",
	sourcemap: false,
	external: ["./locales/*", "@electric-sql/pglite"],
	splitting: true,
	naming: { chunk: "chunks/[hash].[ext]" },
	plugins: [stubOptionalDeps],
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
		"process.env.build_date": JSON.stringify(new Date().toISOString()),
	},
};

console.log(`🔨 Transpiling ${entrypoints.length} files...`);

const result = await Bun.build(buildConfig);

if (result.success) {
	console.log(`✅ Build successful! Generated ${result.outputs.length} files in ./dist`);
} else {
	console.error("❌ Build failed");
	for (const message of result.logs) {
		console.error(message);
	}
	process.exit(1);
}

console.timeEnd("✅ Build complete");
