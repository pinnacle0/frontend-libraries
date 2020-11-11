import {TaggedError} from "./type";

function taggedErrorFactory(tag: string) {
    return function createError(message: string): TaggedError {
        const error = new Error(message) as TaggedError;
        error["@@tag"] = "ConfigGeneratorError";
        error.raw = {tag, message};
        return error;
    };
}

function isTaggedError(err: unknown): err is TaggedError {
    return Boolean(err && typeof err === "object" && (err as any)["@@tag"] === "ConfigGeneratorError");
}

function validateFileExtension(ext: string): void {
    const createError = taggedErrorFactory("[ConfigGenerator.Utility.validateFileExtension]");
    if (ext.trim() === "") {
        throw createError("Extension cannot be empty");
    } else if (/\s/.test(ext)) {
        throw createError(`Extension cannot contain whitespace, received: "${ext}"`);
    } else if (!/^(\.[a-z0-9]+)+$/.test(ext)) {
        throw createError(`Extension should begin with dot, and contains lowercase letters and numbers, received: "${ext}"`);
    }
}

function regExpForFileExtension(...extensions: [string, ...string[]]): RegExp {
    const createError = taggedErrorFactory("[ConfigGenerator.Utility.regExpForFileExtension]");
    const escapedExtensions: string[] = [];
    for (const ext of extensions) {
        try {
            validateFileExtension(ext);
            escapedExtensions.push(ext.replace(/\./, String.raw`\.`));
        } catch (error) {
            if (isTaggedError(error)) {
                throw createError(error.raw.message);
            }
            throw error;
        }
    }
    return new RegExp(escapedExtensions.join("|") + String.raw`$`);
}

export const Utility = Object.freeze({
    taggedErrorFactory,
    isTaggedError,
    validateFileExtension,
    regExpForFileExtension,
});
