import * as path from "path";
import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginJson from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript2 from "rollup-plugin-typescript2";

const FilePath = {
    project: path.join(__dirname, ".."),

    rollupInputFile: path.join(__dirname, "../src/index.ts"),
    rollupOutputFile: path.join(__dirname, "../build/index.js"),
    tsConfigForSrc: path.join(__dirname, "../config/tsconfig.src.json"),
};

/** @type {import("rollup").RollupOptions} */
const config = {
    input: [FilePath.rollupInputFile],
    output: [{file: FilePath.rollupOutputFile, format: "commonjs"}],
    external: ["eslint", /^eslint-.*/, /^@typescript-eslint\/.*/],
    plugins: [
        rollupPluginNodeResolve(),
        rollupPluginCommonjs(),
        rollupPluginJson(),
        rollupPluginTypescript2({
            cwd: FilePath.project,
            tsconfig: FilePath.tsConfigForSrc,
            tsconfigOverride: {
                compilerOptions: {
                    module: "ES2015",
                    declaration: false,
                },
            },
        }),
    ],
};

export default config;
