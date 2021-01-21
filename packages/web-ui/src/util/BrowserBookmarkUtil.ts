import {i18n} from "../internal/i18n/util";
import {ModalUtil} from "./ModalUtil";
import {TextUtil} from "../internal/TextUtil";
import {BrowserUtil} from "./BrowserUtil";

function addToBookmark() {
    const crossBrowserWindowObject: any = window;
    if (crossBrowserWindowObject.sidebar && typeof crossBrowserWindowObject.sidebar.addPanel === "function") {
        // Old Firefox
        crossBrowserWindowObject.sidebar.addPanel(location.href, document.title, "");
    } else if (crossBrowserWindowObject.external && typeof crossBrowserWindowObject.external.AddFavorite === "function") {
        // IE
        crossBrowserWindowObject.external.AddFavorite(location.href, document.title);
    } else {
        // Not supported (most cases)
        const shortcutKey = BrowserUtil.isMobile() ? null : BrowserUtil.os() === "mac" ? "Command + D" : "Ctrl + D";
        const t = i18n();
        ModalUtil.createSync({body: shortcutKey ? TextUtil.interpolate(t.addBookmarkWithShortcut, shortcutKey) : t.addBookmarkManually});
    }
}
export const BrowserBookmarkUtil = Object.freeze({
    addToBookmark,
});
