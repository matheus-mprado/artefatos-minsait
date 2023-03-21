import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import ViteRadar from "vite-plugin-radar";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteRadar({
    enableDev: true,
    analytics:{
      id:"G-5FNT24WH21"
    }
  })],
  server: {
    watch: {
      usePolling: true,
    },
  },
});
