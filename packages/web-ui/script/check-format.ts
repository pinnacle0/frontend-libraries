import path from "path";
import {runCommand} from "./run-command";

runCommand(
    String.raw`yarn run prettier \
    --config ${path.join(__dirname, "../../../prettier.config.js")} \
    --ignore-path ${path.join(__dirname, "../../../.prettierignore")} \
    --list-different \
    "${path.join(__dirname, "**/*.{js,json,jsx,less,ts,tsx}")}"`
);
