import chalk from "chalk";
import {APP_NAME} from "../constant.js";

export function createCheckerMessage(message: string): string {
    return chalk.magenta(APP_NAME + ": ") + message;
}

function debug(object: object) {
    console.info(object);
}

function message(value: string) {
    console.info(createCheckerMessage(value));
}

function error(error: Error) {
    console.info(createCheckerMessage(`${chalk.bgRed(" ERROR ")} ${error.message}`));
}

export const Logger = Object.freeze({
    debug,
    message,
    error,
});
