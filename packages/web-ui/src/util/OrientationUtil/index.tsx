import {BrowserUtil} from "../BrowserUtil";

/**
 * Orientation detection utility for mobile and desktop devices.
 *
 * For Android,
 * Uses the ScreenOrientation API for checking the orientation of the screen.
 * For Deprecated browsers, it uses the window.orientation API.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation
 *
 * For iOS 26.0+ PWA, it does not dispatch any event when the orientation changes,
 * For iOS,
 * Only support iOS 14+
 * Use media queries to check the orientation of the screen for iOS.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
 */

export type OrientationType = "portrait" | "landscape";
export type Subscriber = (orientation: OrientationType) => void;

function isIOSPWA(): boolean {
    return window.matchMedia("(display-mode: standalone)").matches || ("standalone" in window.navigator && window.navigator.standalone === true);
}

function orientationFromAngle(angle: number): OrientationType {
    return Math.abs(angle) === 90 ? "landscape" : "portrait";
}

function currentByDeviceAngle(): OrientationType | null {
    if (typeof window.screen.orientation !== "undefined") {
        return orientationFromAngle(window.screen.orientation.angle);
    } else if (typeof window.orientation === "number") {
        return orientationFromAngle(window.orientation);
    }
    return null;
}

function currentByMediaQuery(): OrientationType {
    return window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
}

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

        if (BrowserUtil.os() === "ios" && isIOSPWA()) {
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
        // do nothing in case of unsupported API
    }
}

function current(): OrientationType {
    try {
        if (BrowserUtil.os() === "ios") {
            return currentByDeviceAngle() ?? currentByMediaQuery();
        } else if (typeof window.screen.orientation !== "undefined") {
            return orientationFromAngle(window.screen.orientation.angle);
        } else {
            return orientationFromAngle(window.orientation);
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
