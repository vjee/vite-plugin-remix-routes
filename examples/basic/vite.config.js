import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRemixRoutes from "../..";

export default defineConfig({
  plugins: [
    react(),
    reactRemixRoutes({
      importMode: (route) => "async",
    }),
  ],
});
