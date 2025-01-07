import path from "path";
import rollupPluginCommonjs from "@rollup/plugin-commonjs";
import rollupPluginJson from "@rollup/plugin-json";
import rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import rollupPluginTypescript from "@rollup/plugin-typescript";

const FilePath = {
    project: path.join(import.meta.dirname, ".."),
    rollupInputFile: path.join(import.meta.dirname, "../src/index.ts"),
    rollupOutputFile: path.join(import.meta.dirname, "../build/index.js"),
    tsConfigForSrc: path.join(import.meta.dirname, "../config/tsconfig.src.json"),
};

const config = {
    input: [FilePath.rollupInputFile],
    output: [{file: FilePath.rollupOutputFile, format: "esm"}],
    external: ["typescript", "eslint", /^eslint-.*/, /^@typescript-eslint.*/],
    plugins: [
        rollupPluginNodeResolve(),
        rollupPluginCommonjs({transformMixedEsModules: true}),
        rollupPluginJson(),
        rollupPluginTypescript({
            tsconfig: FilePath.tsConfigForSrc,
            compilerOptions: {
                declaration: true,
            },
        }),
    ],
};

export default config;
