export class RegExpUtil {
    static fileExtension(...extensions: [string, ...string[]]): RegExp {
        const escapedExtensions: string[] = [];
        for (const ext of extensions) {
            RegExpUtil.validateFileExtension(ext);
            escapedExtensions.push(ext.replace(/\./g, String.raw`\.`));
        }
        return new RegExp(`(${escapedExtensions.join("|")})$`);
    }

    private static validateFileExtension(ext: string): void {
        if (ext.trim() === "") {
            throw new Error("Extension cannot be empty.");
        } else if (/\s/.test(ext)) {
            throw new Error(`Extension cannot contain whitespace, received: "${ext}".`);
        } else if (!/^(\.[a-z0-9]+)+$/.test(ext)) {
            throw new Error(`Extension should begin with dot, and contains lowercase letters and numbers, received: "${ext}".`);
        }
    }
}
