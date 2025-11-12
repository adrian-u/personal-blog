import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        outDir: "dist",
        assetsDir: "assets",
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
            },
        },
        copyPublicDir: true,
    },
    publicDir: "public",
    server: {
        port: 5173,
        host: true
    },
})