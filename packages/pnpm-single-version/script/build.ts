import type {SpawnSyncOptionsWithStringEncoding} from "child_process";
import {spawnSync} from "child_process";
import {Utility} from "@pinnacle0/devtool-util/Utility";
import fs from "fs";
import esbuild from "esbuild";
import path from "path";

const outputPath = path.join(import.meta.dirname, "../dist");
const outputPnpmFilePath = path.join(import.meta.dirname, "../src/command/pnpmfile");
const sourceFilePath = path.join(import.meta.dirname, "../src");
const swcConfigFilePath = path.join(import.meta.dirname, "../config/.swcrc");
const tsconfigFilePath = path.join(import.meta.dirname, "../config/tsconfig.src.json");

const spawnOptions: SpawnSyncOptionsWithStringEncoding = {
    encoding: "utf-8",
    shell: true,
    stdio: "inherit",
};

const buildHookBundle = async () => {
    await esbuild.build({
        entryPoints: [path.join(sourceFilePath, "command/pnpmfile/hook.ts")],
        bundle: true,
        outfile: path.join(outputPath, "./hook-bundle.js"),
        platform: "node",
        minify: true,
    });
};

export const build = async () => {
    fs.existsSync(outputPath) && fs.readdirSync(outputPath).forEach(file => fs.rmSync(path.join(outputPath, file), {recursive: true}));
    console.info("> Clean output path");

    Utility.prepareEmptyDirectory(outputPnpmFilePath);
    console.info("> Prepare empty output path");

    await buildHookBundle();
    console.info("> Bundle pnpmfile hook");

    fs.copyFileSync(path.join(sourceFilePath, "command/pnpmfile/.pnpmfile.cjs"), path.join(outputPnpmFilePath, ".pnpmfile.cjs"));
    console.info("> Copied .pnpmfile.cjs template");

    await spawnSync("swc", [sourceFilePath, "-d", outputPath, "--config-file", swcConfigFilePath], spawnOptions);
    console.info("> Transpiled");

    await spawnSync("tsc", ["-P", tsconfigFilePath, "--emitDeclarationOnly"], spawnOptions);
    console.info("> d.ts generated");
};

build();
