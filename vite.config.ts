import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: "src/mock",
        enable: false,
      }),
    ],
    base: process.env.VITE_APP_BASE || "/",
    server: {
      proxy: {
        "/api": {
          target: "http://127.0.0.1:3005",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
