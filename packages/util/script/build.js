/* eslint-env node */

// TODO: refactor using ts-node
const chalk = require("chalk");
const childProcess = require("child_process");
const fs = require("fs-extra");
const path = require("path");

function spawn(command, args, errorMessage) {
    const isWindows = process.platform === "win32"; // spawn with {shell: true} can solve .cmd resolving, but prettier doesn't run correctly on mac/linux
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, args, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(chalk`{red.bold ${errorMessage}}`);
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${args.join(" ")}`);
        process.exit(1);
    }
}

function cleanup() {
    console.info(chalk`{green.bold [task]} {white.bold cleanup}`);
    fs.emptyDirSync("build");
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    return spawn("prettier", ["--config", "config/prettier.config.js", "--list-different", "{src,test}/**/*.{ts,tsx}"], "check code style failed, please format above files");
}

function test() {
    console.info(chalk`{green.bold [task]} {white.bold test}`);
    return spawn("jest", ["--config", "config/jest.config.js"], "test failed, please fix");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["--config", "config/.eslintrc.js", "{src,test}/**/*.{ts,tsx}"], "lint failed, please fix");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    spawn("tsc", ["-p", "config/tsconfig.json"], "compile failed, please fix");
    spawn("tsc", ["-p", "config/tsconfig-cjs.json"], "compile failed, please fix");
    spawn("tsc", ["-p", "src/browser/tsconfig.json"], "compile failed, please fix");
    return spawn("tsc", ["-p", "src/browser/tsconfig-cjs.json"], "compile failed, please fix");
}

function copyAssets() {
    const sourceDirectory = path.resolve(__dirname, "../src");
    const files = fs.readdirSync(sourceDirectory).map(dir => path.join(sourceDirectory, dir));
    while (files.length > 0) {
        const filename = files.shift();
        if (fs.statSync(filename).isDirectory()) {
            files.push(...fs.readdirSync(filename).map(file => path.join(filename, file)));
        } else if (/\.tsx?$/.test(filename)) {
            const regex = /require\((.*)\)/g;
            const fileContent = fs.readFileSync(filename).toString();
            let copiedAssetCount = 0;
            let matchedArray;

            while ((matchedArray = regex.exec(fileContent)) !== null) {
                copiedAssetCount++;
                const assetFilePath = path.join(path.dirname(filename), matchedArray[1].replace(/"/g, ""));
                if (fs.pathExistsSync(assetFilePath)) {
                    fs.copySync(assetFilePath, assetFilePath.replace(/src/, "build/dist"));
                } else {
                    throw new Error(`Failed to copy asset file: ${assetFilePath}`);
                }
            }

            if (copiedAssetCount > 0) {
                console.info(chalk`{green.bold [task]} {white.bold copy asset}: ${path.dirname(filename)}, ${copiedAssetCount} assets copied`);
            }
        }
    }
}

function distribute() {
    console.info(chalk`{green.bold [task]} {white.bold distribute}`);
    fs.mkdirsSync("build/dist");
    fs.copySync("build/out", "build/dist/", {dereference: true});
    fs.copySync("package.json", "build/dist/package.json", {dereference: true});
    fs.copySync("README.md", "build/dist/README.md", {dereference: true});
    fs.removeSync("build/out");
}

function build() {
    // TODO: add fast-mode too
    cleanup();
    checkCodeStyle();
    test();
    lint();
    compile();
    copyAssets();
    distribute();

    console.info(chalk`{yellow.bold Build Successfully}`);
}

build();
