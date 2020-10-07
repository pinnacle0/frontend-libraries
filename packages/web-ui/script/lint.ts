import path from "path";
import {runCommand} from "./run-command";

runCommand(
    String.raw`yarn run eslint \
    --config ${path.join(__dirname, "../../../.eslintrc.js")} \
    --ignore-path ${path.join(__dirname, "../../../.eslintignore")} \
    --ext .js,.jsx,.ts,.tsx \
    ${path.join(__dirname, "..")}`
);
