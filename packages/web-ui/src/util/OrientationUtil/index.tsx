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

import {BrowserUtil} from "../BrowserUtil";

const supportScreenOrientationAPI = typeof window.screen.orientation !== "undefined";

export type OrientationType = "portrait" | "landscape";

export type Subscriber = (orientation: OrientationType) => void;

function subscribe(subscriber: Subscriber) {
    const handler = () => subscriber(current());
    if (BrowserUtil.os() === "ios") {
        const mediaQuery = window.matchMedia("(orientation: portrait)");
        if (mediaQuery instanceof EventTarget) {
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }
    } else if (supportScreenOrientationAPI) {
        window.screen.orientation.addEventListener("change", handler);
        return () => window.screen.orientation.removeEventListener("change", handler);
    } else {
        window.addEventListener("orientationchange", handler);
        return () => window.removeEventListener("orientationchange", handler, false);
    }
}

function current(): OrientationType {
    try {
        if (BrowserUtil.os() === "ios") {
            return window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape";
        } else if (supportScreenOrientationAPI) {
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
