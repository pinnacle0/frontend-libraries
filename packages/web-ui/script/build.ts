import chalk from "chalk";
import childProcess from "child_process";
import fs from "fs-extra";
import path from "path";
import yargs from "yargs";

function spawn(command: string, args: string[], errorMessage: string) {
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

function unitTest() {
    console.info(chalk`{green.bold [task]} {white.bold unit test}`);
    return spawn("jest", ["--config", "config/jest.config.js"], "test failed, please fix");
}

function lint() {
    console.info(chalk`{green.bold [task]} {white.bold lint}`);
    return spawn("eslint", ["--config", "config/.eslintrc.js", "{src,test}/**/*.{ts,tsx}"], "lint failed, please fix");
}

function compile() {
    console.info(chalk`{green.bold [task]} {white.bold compile}`);
    return spawn("tsc", ["-p", "config/tsconfig.web.json", "--outDir", "build/dist", "--noEmit", "false", "-d"], "compile failed, please fix");
}

function copyAssets() {
    console.info(chalk`{green.bold [task]} {white.bold copy assets}`);
    const sourceDirectory = path.resolve(__dirname, "../src");
    const supportedExtensions = [".less", ".css", ".json", ".jpg", ".png", ".gif", ".mp3", ".mp4", ".wmv"];
    fs.copySync(sourceDirectory, "build/dist", {
        filter: source => {
            const extension = path.extname(source);
            // source may be a directory or a file under the directory.
            if (fs.statSync(source).isDirectory()) {
                return true;
            } else if (supportedExtensions.includes(extension)) {
                console.info(chalk`{green.bold [task]} {white.bold asset copied}: ${path.relative(sourceDirectory, source)}`);
                return true;
            } else {
                if (extension !== ".tsx" && extension !== ".ts") {
                    console.info(chalk`{red.bold [task] unsupported asset extension:} ${path.relative(sourceDirectory, source)}`);
                }
                return false;
            }
        },
        dereference: true,
    });
}

function distribute() {
    console.info(chalk`{green.bold [task]} {white.bold distribute}`);
    fs.copySync("package.json", "build/dist/package.json", {dereference: true});
    fs.copySync("README.md", "build/dist/README.md", {dereference: true});
}

function build() {
    const isFastMode = yargs.argv.mode === "fast";
    if (!isFastMode) {
        checkCodeStyle();
        unitTest();
        lint();
    }
    cleanup();
    compile();
    copyAssets();
    distribute();

    console.info(chalk`{yellow.bold Build Successfully}`);
}

build();
