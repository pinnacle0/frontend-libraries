import {parseUserAgentOS} from "./parseUserAgentOS";
import type {BrowserKernel, BrowserNewTabSizeOptions, BrowserOS} from "./type";

export class BrowserUtil {
    static os(): BrowserOS {
        return parseUserAgentOS(navigator.userAgent);
    }

    static kernel(): BrowserKernel {
        const userAgentUpperCase = navigator.userAgent.toUpperCase();
        if (userAgentUpperCase.includes("MICROMESSENGER")) {
            return "wechat";
        } else if ("WebkitAppearance" in document.documentElement.style) {
            return "webkit";
        } else if (userAgentUpperCase.includes("FIREFOX") && !userAgentUpperCase.includes("SEAMONKEY")) {
            // https://github.com/keithws/browser-report/blob/6fa7a2bb33ce8b8621b2c4538a1ebefac38af57f/index.js#L64
            return "firefox";
        } else if (userAgentUpperCase.includes("MSIE")) {
            // https://github.com/keithws/browser-report/blob/6fa7a2bb33ce8b8621b2c4538a1ebefac38af57f/index.js#L56
            return "ie";
        } else {
            return "other";
        }
    }

    static isMobile() {
        const system = parseUserAgentOS(navigator.userAgent);
        return system === "ios" || system === "android";
    }

    static removeElement(element: HTMLElement | null) {
        if (element) {
            try {
                element.remove();
            } catch {
                // Some legacy browser may not support DOM element remove()
                element.parentElement?.removeChild(element);
            }
        }
    }

    static scrollTo(options: ScrollToOptions, container: Element | null = null) {
        if (container) {
            if (container.scrollTo) {
                try {
                    container.scrollTo({...options});
                } catch {
                    container.scrollTo(options.left ?? container.scrollLeft, options.top ?? container.scrollTop);
                }
            } else {
                options.left && (container.scrollLeft = options.left);
                options.top && (container.scrollTop = options.top);
            }
        } else {
            // Some legacy browser may not support DOM element scrollTo({...}) signature, or even scrollTo()
            try {
                window.scrollTo({...options});
            } catch {
                window.scrollTo(options.left ?? window.scrollX, options.top ?? window.scrollY);
            }
        }
    }

    /**
     * Resolve when new tab is loaded, only applicable to same domain.
     * Ref: https://stackoverflow.com/questions/3030859/detecting-the-onload-event-of-a-window-opened-with-window-open
     */
    static newTab(url: string, sizeOptions: Partial<BrowserNewTabSizeOptions> = {}) {
        let features: string | undefined;
        if (Object.keys(sizeOptions).length > 0) {
            features = "toolbar=no,location=no,status=no,menubar=no,resizable=no" + Object.entries(sizeOptions).map(([key, value]) => `,${key}=${value}`);
        }

        const newWindow = window.open(url, "_blank", features);
        if (!newWindow) {
            // In case some browser blocks popup, fallback to same tab open
            window.location.href = url;
        }
    }

    static openQQ(qq: string) {
        const system = parseUserAgentOS(navigator.userAgent);
        if (system === "ios") {
            window.open(`mqq://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web`);
        } else if (system === "android") {
            window.open(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}`);
        } else {
            window.open(`tencent://message/?uin=${qq}&Site=Sambow&Menu=yes`);
        }
    }

    static isDarkTheme(): boolean {
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
}
