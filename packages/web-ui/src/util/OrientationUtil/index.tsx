import {BrowserUtil} from "../BrowserUtil";

export type OrientationType = "portrait" | "landscape";
export type Subscriber = (orientation: OrientationType) => void;

function subscribe(subscriber: Subscriber): (() => void) | undefined {
    try {
        let lastOrientation = current();

        const handler = () => {
            const newOrientation = current();
            if (newOrientation !== lastOrientation) {
                lastOrientation = newOrientation;
                subscriber(newOrientation);
            }
        };

        if (BrowserUtil.os() === "ios") {
            const mediaQuery = window.matchMedia("(orientation: portrait)");
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        } else if (typeof window.screen.orientation !== "undefined") {
            window.screen.orientation.addEventListener("change", handler);
            return () => window.screen.orientation.removeEventListener("change", handler);
        } else {
            window.addEventListener("orientationchange", handler);
            return () => window.removeEventListener("orientationchange", handler, false);
        }
    } catch {
        // do nothing in case of no such API support
    }
}

function current(): OrientationType {
    try {
        if (BrowserUtil.os() === "ios") {
            return window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
        } else if (typeof window.screen.orientation !== "undefined") {
            return window.screen.orientation.angle === 0 ? "portrait" : "landscape";
        } else {
            return window.orientation === 0 ? "portrait" : "landscape";
        }
    } catch {
        // Do not use window.innerHeight/window.innerWidth comparison, because it is incorrect if keyboard is popped up
        return "portrait";
    }
}

export const OrientationUtil = Object.freeze({
    subscribe,
    current,
});
