import {createCheckerMessage} from "./logger.js";
import {hookLogger} from "@pnpm/core-loggers";

function message(value: string) {
    hookLogger.info({message: createCheckerMessage(value), prefix: ""});
}

function error(error: Error) {
    hookLogger.error(error);
}

export const pnpmLogger = Object.freeze({
    message,
    error,
});
