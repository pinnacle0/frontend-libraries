import type {BoleLogger} from "../type.js";
import {createCheckerMessage} from "./logger.js";

/**
 * Reason of create a brand new logger:
 * 1. console.log is inconsistent in .pnpmfile.cjs @see https://github.com/pnpm/pnpm/issues/1074
 * 2. hookLogger in @pnpm/core-logger does not completely fulfill our needs
 */

const baseLogger: BoleLogger = require("bole")("pnpm");

function message(value: string) {
    baseLogger.info(createCheckerMessage(value));
}

function error(error: Error) {
    baseLogger.error(error);
}

export const pnpmLogger = Object.freeze({
    message,
    error,
});
