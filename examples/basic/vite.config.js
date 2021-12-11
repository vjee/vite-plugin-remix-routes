import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import remixRoutes from "../..";

export default defineConfig({
  plugins: [
    react(),
    remixRoutes({
      importMode: (route) => "async",
    }),
  ],
});
