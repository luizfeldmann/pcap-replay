import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Check if was run as 'npm run mock'
    __MOCK__: JSON.stringify(mode === "mock"),
    // Build timestamp
    __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()),
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  resolve: {
    alias: {
      shared: path.resolve(__dirname, "../shared/src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
      },
    },
  },
}));
