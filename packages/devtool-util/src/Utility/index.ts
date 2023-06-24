import {createConsoleLogger} from "./createConsoleLogger";
import {prepareEmptyDirectory} from "./prepareEmptyDirectory";
import {replaceTemplate} from "./replaceTemplate";
import {getTemplatePath} from "./getTemplatePath";
import {runCommand} from "./runCommand";

export const Utility = Object.freeze({
    createConsoleLogger,
    prepareEmptyDirectory,
    replaceTemplate,
    runCommand,
    getTemplatePath,
});
