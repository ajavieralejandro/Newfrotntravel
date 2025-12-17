import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // tus alias
  },

  build: {
    sourcemap: true,           // ✅ clave para saber “dónde es”
    manifest: true,
    outDir: path.resolve(__dirname, "../../../../public/build-newfrotntravel"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/main.tsx"),
    },
  },
});
