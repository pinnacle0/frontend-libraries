import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

const config = defineConfig({
    build: {
        assetsInlineLimit: 1024000,
    },
    plugins: [react()],
});

export default config;
