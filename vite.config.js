import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  if (mode === "production" && env.VITE_API_URL) {
    console.warn(
      `\n[shopsphere] VITE_API_URL is set (${env.VITE_API_URL}) so the browser will call the API cross-site. ` +
        "Auth cookies become third-party and Google login can fail with state_mismatch. " +
        "Unset VITE_API_URL in production and keep the /api rewrite in vercel.json.\n"
    );
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // Only used when VITE_API_URL is empty: forwards /api to the local backend.
      proxy: {
        "/api": {
          target: env.VITE_DEV_API_TARGET || "http://127.0.0.1:5000",
          changeOrigin: false,
        },
      },
    },
  };
});
