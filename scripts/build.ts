import path from "node:path";

import { build, LibraryFormats } from "vite";

const fileName = (format: string) => `index.${format === "es" ? "js" : "cjs"}`;
const formats: LibraryFormats[] = ["es", "cjs"];

await build({
  build: {
    outDir: "dist/node",
    lib: {
      entry: path.resolve(process.cwd(), "lib/node/index.ts"),
      formats,
      fileName,
    },
    rollupOptions: {
      external: [/@remix-run\/dev\/.+/g, "vite"],
    },
  },
});

await build({
  build: {
    outDir: "dist/client",
    lib: {
      entry: path.resolve(process.cwd(), "lib/client/index.ts"),
      formats,
      fileName,
    },
    rollupOptions: {
      external: ["react", "react-router-dom"],
    },
  },
});
