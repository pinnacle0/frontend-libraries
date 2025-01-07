import {createConsoleLogger} from "./createConsoleLogger.js";
import {prepareEmptyDirectory} from "./prepareEmptyDirectory.js";
import {replaceTemplate} from "./replaceTemplate.js";
import {getTemplatePath} from "./getTemplatePath.js";
import {runCommand} from "./runCommand.js";

export const Utility = Object.freeze({
    createConsoleLogger,
    prepareEmptyDirectory,
    replaceTemplate,
    runCommand,
    getTemplatePath,
});
