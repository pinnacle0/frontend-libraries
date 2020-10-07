/* eslint-env node */

const path = require("path");
const runCommand = require("./run-command");

runCommand(
    String.raw`yarn run jest \
    --config ${path.join(__dirname, "../config/jest.config.js")} \
    --runInBand \
    --coverage`
);
