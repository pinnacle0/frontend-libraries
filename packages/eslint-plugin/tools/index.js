/* eslint-env node */
// @ts-check

require("ts-node").register({
    compilerOptions: require("../../../tsconfig.json").compilerOptions,
});

const path = require("path");

const fileArg = path.basename(process.argv[2]);

if (fileArg !== process.argv[2] || fileArg.includes(path.sep)) {
    console.error(`[tools] invalid usage: script arg should not reference any directory or contain path seperator: "${process.argv[2]}"\n`);
    process.exit(1);
}

if (path.extname(fileArg) !== "") {
    console.error(`[tools] invalid usage: script arg should not contain file extension: "${path.extname(fileArg)}"\n`);
    process.exit(1);
}

if (fileArg === "index") {
    console.error(`[tools] invalid usage: script arg cannot be "index"\n`);
    process.exit(1);
}

const scriptFile = path.join(__dirname, fileArg);

async function run() {
    //    // eslint-disable-next-line import/no-dynamic-require -- dynamic require tools script
    const script = require(scriptFile);
    if (typeof script === "function") {
        await script();
    } else if (typeof script.default === "function") {
        await script.default();
    }
}

run().catch(error => {
    console.error();
    console.error(`[tools] fatal: script execution failure "${scriptFile}"\n`);
    if (error && typeof error === "object" && "message" in error) {
        console.error(`${error.message}\n`);
    }
    process.exit(1);
});
