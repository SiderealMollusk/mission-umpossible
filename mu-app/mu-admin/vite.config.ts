import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: ["mu-admin.virgil.info"],
  },
  build: {
    sourcemap: mode === "development",
  },
  // This allows to have sourcemaps in production. They are not loaded unless you open the devtools
  // Remove this line if you don't need to debug react-admin in production
  resolve: { alias: getAliasesToDebugInProduction() },
  base: "./",
}));

function getAliasesToDebugInProduction() {
  return [
  { find: "react-admin", replacement: path.resolve(__dirname, "./node_modules/react-admin/src") },
  { find: "ra-core", replacement: path.resolve(__dirname, "./node_modules/ra-core/src") },
  {
    find: "ra-ui-materialui",
    replacement: path.resolve(__dirname, "./node_modules/ra-ui-materialui/src"),
  },
  {
    find: "ra-i18n-polyglot",
    replacement: path.resolve(__dirname, "./node_modules/ra-i18n-polyglot/src"),
  },
  {
    find: "ra-language-english",
    replacement: path.resolve(__dirname, "./node_modules/ra-language-english/src"),
  },
  {
    find: "ra-data-json-server",
    replacement: path.resolve(__dirname, "./node_modules/ra-data-json-server/src"),
  },
  {
    find: "ra-data-simple-rest",
    replacement: path.resolve(__dirname, "./node_modules/ra-data-simple-rest/src"),
  },
  {
    find: "ra-data-fakerest",
    replacement: path.resolve(__dirname, "./node_modules/ra-data-fakerest/src"),
  },
  // add any other react-admin packages you have
];
}