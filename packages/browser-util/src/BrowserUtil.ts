export type BrowserOS = "Windows" | "Mac" | "iOS" | "Android" | "other";
export type BrowserKernel = "webkit" | "firefox" | "ie" | "other";

function os(): BrowserOS {
    // TODO
    return "other";
}

function kernel(): BrowserKernel {
    // TODO
    return "other";
}

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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

function openQQ(qq: string) {
    if (isMobile()) {
        if (os() === "iOS") {
            window.open(`mqq://im/chat?chat_type=wpa&uin=${qq}&version=1&src_type=web`);
        } else {
            window.open(`mqqwpa://im/chat?chat_type=wpa&uin=${qq}`);
        }
    } else {
        window.open(`tencent://message/?uin=${qq}&Site=Sambow&Menu=yes`);
    }
}

export const BrowserUtil = Object.freeze({
    os,
    kernel,
    isMobile,
    isWechat,
    removeElement,
    scrollTo,
    openTabAndWait,
    openQQ,
});
