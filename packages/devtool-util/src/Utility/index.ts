import {createConsoleLogger} from "./createConsoleLogger";
import {prepareFolder} from "./prepareFolder";
import {replaceTemplate} from "./replaceTemplate";
import {runCommand} from "./runCommand";

export class Utility {
    static createConsoleLogger = createConsoleLogger;
    static prepareFolder = prepareFolder;
    static replaceTemplate = replaceTemplate;
    static runCommand = runCommand;
    // TODO: prepareEmptyDir(): if exist, remove, then mkdir
}
