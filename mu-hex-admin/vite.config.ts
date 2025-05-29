import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      // This helps Vite resolve ra-supabase correctly if it's installed from GitHub or locally
      'ra-supabase': path.resolve(__dirname, 'node_modules/ra-supabase'),
      'ra-supabase-core': path.resolve(__dirname, 'node_modules/ra-supabase-core'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    host: true,
  },
  build: {
    sourcemap: mode === "development",
  },
  base: "./",
}));