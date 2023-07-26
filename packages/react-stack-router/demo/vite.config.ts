import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import basicSSL from '@vitejs/plugin-basic-ssl'

export default defineConfig({
    server: {
        https: true,
        port: 7444,
    },
    plugins: [react(), basicSSL() ],
});
