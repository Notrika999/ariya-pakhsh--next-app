import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

const rootDir = process.cwd();
const outDir = path.join(rootDir, ".next", "attribution-tests");
const entryFile = path.join(outDir, "entry.ts");
const outFile = path.join(outDir, "entry.mjs");

await mkdir(outDir, { recursive: true });
await writeFile(
  entryFile,
  [
    'import "../../src/lib/attribution/attribution.test.ts";',
    'import "../../src/lib/auth/auth-route-utils.test.ts";',
    "",
  ].join("\n"),
  "utf8",
);

await build({
  entryPoints: [entryFile],
  outfile: outFile,
  bundle: true,
  platform: "node",
  format: "esm",
  sourcemap: "inline",
  external: ["node:test", "node:assert/strict"],
  plugins: [
    {
      name: "test-shims",
      setup(build) {
        build.onResolve({ filter: /^server-only$/ }, () => ({
          path: path.join(rootDir, "scripts", "test-shims", "server-only.mjs"),
        }));
        build.onResolve({ filter: /^next\/server$/ }, () => ({
          path: path.join(rootDir, "scripts", "test-shims", "next-server.mjs"),
        }));
        build.onResolve({ filter: /^next\/headers$/ }, () => ({
          path: path.join(rootDir, "scripts", "test-shims", "next-headers.mjs"),
        }));
      },
    },
  ],
});

const child = spawn(process.execPath, ["--test", outFile], {
  cwd: rootDir,
  stdio: "inherit",
});

const exitCode = await new Promise((resolve) => {
  child.on("exit", (code) => resolve(code ?? 1));
});

await rm(outDir, { recursive: true, force: true });
process.exit(exitCode);
