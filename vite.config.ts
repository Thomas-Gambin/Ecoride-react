import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")

  /**
   * Proxy dev : le navigateur appelle Vite (`/api/*`), Vite relaie vers Symfony.
   *
   * Exemples de `VITE_DEV_PROXY_TARGET` :
   * - http://127.0.0.1:8000 (front local, back local)
   * - http://host.docker.internal:8000 (front Docker, back exposé sur le host)
   * - http://<service_symfony>:8000 (même réseau Docker partagé entre les 2 compose)
   */
  const apiProxyTarget =
    env.VITE_DEV_PROXY_TARGET?.replace(/\/+$/, "") || "http://127.0.0.1:8000"

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      port: 5173,
      watch: {
        usePolling: true,
      },
      proxy: {
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
