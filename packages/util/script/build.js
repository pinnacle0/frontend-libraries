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
    fs.emptyDirSync("dist");
}

function checkCodeStyle() {
    console.info(chalk`{green.bold [task]} {white.bold check code style}`);
    require("./check-format");
}

function test() {
    console.info(chalk`{green.bold [task]} {white.bold test}`);
    require("./jest");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    require("./lint");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    spawn("tsc", ["-b", "tsconfig.json"], "compile failed, please fix");
}

function deleteTsBuildInfoFiles() {
    console.info(chalk`{green.bold [task]} {white.bold delete tsbuildinfo files}`);
    fs.readdirSync("dist", {encoding: "utf8"})
        .filter(file => file.toLowerCase().endsWith(".tsbuildinfo"))
        .map(file => path.join("dist", file))
        .forEach(file => fs.unlinkSync(file));
}

function distribute() {
    console.info(chalk`{green.bold [task]} {white.bold distribute}`);
    fs.copySync("package.json", "dist/package.json", {dereference: true});
    fs.copySync("README.md", "dist/README.md", {dereference: true});
    fs.copySync("LICENSE.md", "dist/LICENSE.md", {dereference: true});
}

function build() {
    const yargs = require("yargs");
    const isFastMode = yargs.argv.mode === "fast";
    cleanup();
    if (isFastMode) {
        console.info("Fast mode enabled, skipping format checking and testing");
    } else {
        checkCodeStyle();
        test();
        lint();
    }
    compile();
    deleteTsBuildInfoFiles();
    distribute();

    console.info(chalk`{yellow.bold Build Successfully}`);
}

build();
