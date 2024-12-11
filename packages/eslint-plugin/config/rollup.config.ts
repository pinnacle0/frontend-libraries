import path from "path";
import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginJson from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript2 from "rollup-plugin-typescript2";

const FilePath = {
    project: path.join(import.meta.dirname, ".."),

    rollupInputFile: path.join(import.meta.dirname, "../src/index.ts"),
    rollupOutputFile: path.join(import.meta.dirname, "../build/index.js"),
    tsConfigForSrc: path.join(import.meta.dirname, "../config/tsconfig.src.json"),
};

/** @type {import("rollup").RollupOptions} */
const config = {
    input: [FilePath.rollupInputFile],
    output: [{file: FilePath.rollupOutputFile, format: "esm"}],
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
                    declaration: true,
                },
            },
        }),
    ],
};

export default config;
