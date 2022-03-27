import path from "node:path";
import fs from "node:fs/promises";

import tsup from "tsup";

const dist = path.join(__dirname, "..", "dist");

const watch = process.argv.includes("--watch");

await fs
  .access(dist)
  .then(() => fs.rm(dist, { recursive: true }))
  .catch(() => {});

const nodeBuild = tsup.build({
  entryPoints: ["lib/node/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  outDir: "dist/node",
  watch,
});

const clientBuild = tsup.build({
  entryPoints: ["lib/client/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  outDir: "dist/client",
  watch,
});

await Promise.all([nodeBuild, clientBuild]);
