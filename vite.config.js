import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Set a fixed port
    strictPort: true, // Prevent trying other ports if 5173 is in use
  },
});
