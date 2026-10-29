import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Rutas relativas: el mismo build funciona en cualquier URL de GitHub Pages
  // (PRD y QAS viven en repos con nombres distintos).
  base: "./",
  server: {
    // Para probar desde el iPhone por túnel (cloudflared): Vite bloquea hosts desconocidos.
    allowedHosts: [".trycloudflare.com"],
  },
});
