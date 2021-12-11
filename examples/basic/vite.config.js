import react from "@vitejs/plugin-react";
import remixRoutes from "vite-plugin-remix-routes";

export default {
  plugins: [
    react(),
    remixRoutes({
      importMode: () => "async",
    }),
  ],
};
