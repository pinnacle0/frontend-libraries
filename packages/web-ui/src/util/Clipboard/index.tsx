async function copyText(text: string) {
    // navigator.clipboard supposed to be unavailable only in local http server
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
    } else {
        const element = document.createElement("textarea");
        element.value = text;
        element.style.position = "absolute";
        element.style.left = "-9999px";
        element.setAttribute("readonly", "");
        document.body.appendChild(element);

        // In case there is already some text selection by user, store the previous selection & recover later
        const selection = document.getSelection();
        const selected = selection != null && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        element.select();
        document.execCommand("copy");
        document.body.removeChild(element);

        if (selection && selected) {
            selection.removeAllRanges();
            selection.addRange(selected);
        }
    }
}

/**
 * - PNG only, because JPEG requires extra transformation via canvas
 * - supported by Chrome 76+ and safari 13.1+
 */
async function copyImage(base64Image: string) {
    if (navigator.clipboard && "ClipboardItem" in window) {
        const [base64Metadata, base64String] = base64Image.trim().split(";base64,");
        if (base64Metadata !== "data:image/png") return false;

        const unicodeArray = atob(base64String)
            .split("")
            .map(_ => _.charCodeAt(0));
        const blob = new Blob([Uint8Array.from(unicodeArray)], {type: "image/png"});
        await navigator.clipboard.write([new window.ClipboardItem({"image/png": blob})]);
        return true;
    } else {
        return false;
    }
}

export const Clipboard = Object.freeze({
    copyText,
    copyImage,
});
