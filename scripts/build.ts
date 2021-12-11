import path from "node:path";
import url from "node:url";
import fs from "node:fs/promises";

import tsup from "tsup";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const dist = path.join(__dirname, "..", "dist");

await fs
  .access(dist)
  .then(() => fs.rm(dist, { recursive: true }))
  .catch(() => {});

await tsup.build({
  entryPoints: ["lib/node/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  outDir: "dist/node",
});

await tsup.build({
  entryPoints: ["lib/client/index.ts"],
  format: ["esm"],
  dts: true,
  outDir: "dist/client",
});
