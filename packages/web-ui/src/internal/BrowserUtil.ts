function isMac() {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

function isWebkit() {
    return "WebkitAppearance" in document.documentElement.style;
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isIos() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid() {
    return /Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isWechat() {
    return /MicroMessenger/i.test(navigator.userAgent);
}

function scrollTo(target: number, container: Element | null = null) {
    /**
     * For some legacy browser, they might not support scrollTo({...}) signature, or even scrollTo function.
     */
    if (container) {
        if (container.scrollTo) {
            try {
                container.scrollTo({top: target, behavior: "smooth"});
            } catch (e) {
                container.scrollTo(0, target);
            }
        } else {
            container.scrollTop = target;
        }
    } else {
        try {
            window.scrollTo({top: target, behavior: "smooth"});
        } catch (e) {
            window.scrollTo(0, target);
        }
    }
}

/**
 * Resolve when new tab is loaded, only applicable to same domain.
 * Ref: https://stackoverflow.com/questions/3030859/detecting-the-onload-event-of-a-window-opened-with-window-open
 */
function openTabAndWait(url: string): Promise<void> {
    return new Promise<void>(resolve => {
        const newWindow = window.open(url, "_blank");
        if (newWindow) {
            newWindow.addEventListener("load", () => resolve(), true);
            newWindow.addEventListener("error", () => resolve(), true);
        } else {
            // In case some browser blocks popup, fallback to same tab open
            window.location.href = url;
        }
    });
}

export const BrowserUtil = Object.freeze({
    isMac,
    isWebkit,
    isMobile,
    isIos,
    isAndroid,
    isWechat,
    scrollTo,
    openTabAndWait,
});
