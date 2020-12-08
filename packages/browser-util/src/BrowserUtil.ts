export type BrowserOS = "Windows" | "Mac" | "iOS" | "Android" | "other";
export type BrowserKernel = "webkit" | "firefox" | "ie" | "other";
export interface BrowserNewTabSizeOptions {
    width: number;
    height: number;
    top: number;
    left: number;
}

function os(): BrowserOS {
    // TODO/Lok
    return "other";
}

function kernel(): BrowserKernel {
    // TODO/Lok
    return "other";
}

// TODO: just remove following after finish above
/** @deprecated */
function isMac() {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

/** @deprecated */
function isWebkit() {
    return "WebkitAppearance" in document.documentElement.style;
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/** @deprecated */
function isIos() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** @deprecated */
function isAndroid() {
    return /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isWechat() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

function removeElement(element: HTMLElement | null) {
    if (element) {
        try {
            element.remove();
        } catch (e) {
            // Some legacy browser may not support DOM element remove()
            element.parentElement?.removeChild(element);
        }
    }
}

function scrollTo(position: number, container: Element | null = null) {
    if (container) {
        if (container.scrollTo) {
            try {
                container.scrollTo({top: position, behavior: "smooth"});
            } catch (e) {
                container.scrollTo(0, position);
            }
        } else {
            container.scrollTop = position;
        }
    } else {
        // Some legacy browser may not support DOM element scrollTo({...}) signature, or even scrollTo()
        try {
            window.scrollTo({top: position, behavior: "smooth"});
        } catch (e) {
            window.scrollTo(0, position);
        }
    }
}

/**
 * Resolve when new tab is loaded, only applicable to same domain.
 * Ref: https://stackoverflow.com/questions/3030859/detecting-the-onload-event-of-a-window-opened-with-window-open
 */
function newTab(url: string, sizeOptions: Partial<BrowserNewTabSizeOptions> = {}): Promise<void> {
    return new Promise<void>(resolve => {
        let features: string | undefined;
        if (Object.keys(sizeOptions).length > 0) {
            features = "toolbar=no,location=no,status=no,menubar=no,resizable=no" + Object.entries(sizeOptions).map(([key, value]) => `,${key}=${value}`);
        }

        const newWindow = window.open(url, "newTab", features);
        if (newWindow) {
            newWindow.addEventListener("load", () => resolve(), true);
            newWindow.addEventListener("error", () => resolve(), true);
        } else {
            // In case some browser blocks popup, fallback to same tab open
            window.location.href = url;
        }
    });
}

function openQQ(qq: string) {
    if (isMobile()) {
        // TODO: use `os() === "iOS"`
        if (isIos()) {
            window.open(`mqq://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web`);
        } else {
            window.open(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}`);
        }
    } else {
        window.open(`tencent://message/?uin=${qq}&Site=Sambow&Menu=yes`);
    }
}

export const BrowserUtil = Object.freeze({
    isMac,
    isAndroid,
    isIos,
    isMobile,
    isWebkit,
    isWechat,
    removeElement,
    scrollTo,
    newTab,
    openQQ,
});
