import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import deno from "@deno/vite-plugin";

const frontendPort = process.env.server_port
  ? parseInt(process.env.server_port, 10)
  : process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : 3000;

const backendPort = process.env.SERVER_PORT
  ? parseInt(process.env.SERVER_PORT, 10)
  : 8000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), deno()],
  server: {
    port: frontendPort,
    proxy: {
      "/api": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    // `vite preview` does not use `server.proxy`, so we mirror it here
    // to keep `/api/*` working in the production-like container.
    proxy: {
      "/api": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
})