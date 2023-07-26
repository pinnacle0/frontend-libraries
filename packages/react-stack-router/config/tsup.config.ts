import {defineConfig} from "tsup";
import path from "path";

export default defineConfig({
    entry: [path.join(__dirname, "../src") + "/**/*{.ts,.tsx,.less}"],
    outDir: path.join(__dirname, "../dist"),
    clean: true,
    bundle: false,
    skipNodeModulesBundle: true,
    target: "es6",
    format: "esm",
    loader: {
        ".less": "copy",
    },
});
