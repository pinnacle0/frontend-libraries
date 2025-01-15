import path from "path";
import _rollupPluginCommonjs from "@rollup/plugin-commonjs";
import _rollupPluginJson from "@rollup/plugin-json";
import _rollupPluginNodeResolve from "@rollup/plugin-node-resolve";
import _rollupPluginTypescript from "@rollup/plugin-typescript";

// ref: https://github.com/rollup/plugins/issues/1662
// the index.d.ts type file is outside dist/es scope and so consider as cjs project by TS
// TODO/David: remove it if all these rollup plugin fix the issue
const rollupPluginCommonjs = _rollupPluginCommonjs.default;
const rollupPluginJson = _rollupPluginJson.default;
const rollupPluginNodeResolve = _rollupPluginNodeResolve.default;
const rollupPluginTypescript = _rollupPluginTypescript.default;

const FilePath = {
    project: path.join(import.meta.dirname, ".."),
    rollupInputFile: path.join(import.meta.dirname, "../src/index.ts"),
    rollupOutputFile: path.join(import.meta.dirname, "../build/src/index.js"),
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
