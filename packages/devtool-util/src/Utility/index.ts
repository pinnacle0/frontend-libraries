import {createConsoleLogger} from "./createConsoleLogger";
import {prepareEmptyDirectory} from "./prepareEmptyDirectory";
import {replaceTemplate} from "./replaceTemplate";
import {runCommand} from "./runCommand";

export class Utility {
    static createConsoleLogger = createConsoleLogger;
    static prepareEmptyDirectory = prepareEmptyDirectory;
    static replaceTemplate = replaceTemplate;
    static runCommand = runCommand;
    // TODO: prepareEmptyDir(): if exist, remove, then mkdir
}
