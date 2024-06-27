export type BrowserOS = "windows" | "mac" | "ios" | "android" | "other";
export type BrowserKernel = "wechat" | "webkit" | "firefox" | "ie" | "other"; // WeChat is a special webkit, some features restricted
export interface BrowserNewTabSizeOptions {
    width: number;
    height: number;
    top: number;
    left: number;
}
