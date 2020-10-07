/* eslint-env node */

const path = require("path");
const runCommand = require("./run-command");

runCommand(
    String.raw`yarn run prettier \
    --config ${path.join(__dirname, "../../../prettier.config.js")} \
    --ignore-path ${path.join(__dirname, "../../../.prettierignore")} \
    --list-different \
    "${path.join(__dirname, "../{src,test,config,script}/**/*.{js,json,jsx,ts,tsx}")}"`
);
