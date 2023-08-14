/**
 * Return origin only, i.e: protocol://domain(:port)".
 * Or Return NULL if fail to transform.
 *
 * If currentPrefix is null, it will analyze the domain to find the prefix.
 * Else, it will only transform the matched currentPrefix.
 *
 * CAVEAT: leading/ending space in prefix will be trimmed.
 */
function transformOriginPrefix(origin: string, currentPrefix: string | null, newPrefix: string, protocol?: string): string | null {
    if (origin.startsWith("file://")) return null;

    const regex = /^https?:\/\/([a-z0-9-](?!\.$)\.?)+(:\d+)?$/;
    if (!regex.test(origin)) throw new Error("[util] URLUtil.transformOriginPrefix: invalid origin format");

    const isPureIP = /^https?:\/\/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(:\d+)?$/.test(origin);
    if (isPureIP) return null;

    newPrefix = newPrefix.trim();
    if (currentPrefix === null) {
        const firstDotIndex = origin.indexOf(".");
        const secondDotIndex = origin.indexOf(".", firstDotIndex + 1);
        if (firstDotIndex < 0) {
            return null;
        } else if (secondDotIndex < 0) {
            // Short domain in form of "protocol://xxx.xxx"
            const substring1 = origin.substring(0, origin.indexOf("//") + 2);
            const substring2 = origin.substring(origin.indexOf("//") + 2);
            return substring1 + (newPrefix ? newPrefix + "." : "") + substring2;
        } else {
            currentPrefix = origin.substring(origin.indexOf("//") + 2, firstDotIndex);
        }
    } else {
        currentPrefix = currentPrefix.trim();
        if (!currentPrefix) throw new Error("[util] URLUtil.transformOriginPrefix: current prefix empty");
    }

    const prefixRegex = new RegExp("^(https?)(:\\/\\/)(" + currentPrefix + "\\.)");
    if (prefixRegex.test(origin)) {
        return origin.replace(prefixRegex, (protocol || "$1") + "$2" + (newPrefix ? newPrefix + "." : ""));
    } else {
        return null;
    }
}

export const URLUtil = Object.freeze({
    transformOriginPrefix,
});
