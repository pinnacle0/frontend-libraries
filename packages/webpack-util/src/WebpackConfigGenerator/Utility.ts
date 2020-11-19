// TODO: remove
function validateFileExtension(ext: string): void {
    if (ext.trim() === "") {
        throw new Error("Extension cannot be empty");
    } else if (/\s/.test(ext)) {
        throw new Error(`Extension cannot contain whitespace, received: "${ext}"`);
    } else if (!/^(\.[a-z0-9]+)+$/.test(ext)) {
        throw new Error(`Extension should begin with dot, and contains lowercase letters and numbers, received: "${ext}"`);
    }
}

// TODO: move to /Rule folder, as regExpForFileExtension.ts
function regExpForFileExtension(...extensions: [string, ...string[]]): RegExp {
    const escapedExtensions: string[] = [];
    for (const ext of extensions) {
        validateFileExtension(ext);
        escapedExtensions.push(ext.replace(/\./, String.raw`\.`));
    }
    return new RegExp(escapedExtensions.join("|") + String.raw`$`);
}

export const Utility = Object.freeze({
    validateFileExtension,
    regExpForFileExtension,
});
