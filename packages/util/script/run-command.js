/* eslint-env node */

const cp = require("child_process");
const path = require("path");

/** @type {(command: string) => string} */
module.exports = command => {
    return cp.execSync(command, {
        stdio: "inherit",
        encoding: "utf8",
        cwd: path.join(__dirname, "../../../"),
    });
};
