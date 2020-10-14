/* eslint-env node */
// @ts-check

const fs = require("fs");
const path = require("path");

require("ts-node").register({
    project: path.join(__dirname, "../../../config/tsconfig.base.json"),
});

const fileArg = process.argv[2];

const scriptNames = fs
    .readdirSync(__dirname, {encoding: "utf8"})
    .map(directoryEntry => path.join(__dirname, directoryEntry))
    .filter(filepath => fs.statSync(filepath).isFile())
    .filter(filepath => path.extname(filepath).toLowerCase() === ".ts")
    .map(filepath => path.basename(filepath, ".ts"));

if (!scriptNames.includes(fileArg)) {
    console.error(`[tools] invalid script arg "${fileArg}": should be one of ${scriptNames.map(_ => `"${_}"`).join(", ")}\n`);
    process.exit(1);
}

const scriptFile = path.join(__dirname, fileArg);

async function run() {
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
