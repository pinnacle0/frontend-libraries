/**
 * Orientation detection utility for mobile and desktop devices.
 *
 * Uses the ScreenOrientation API for checking the orientation of the screen.
 * For Deprecated browsers, it uses the window.orientation API.
 *
 * For iOS 26.0+ PWA, it does not dispatch any event when the orientation changes,
 * so we need to use media queries to check the orientation of the screen.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
 */

import {BrowserUtil} from "../BrowserUtil";

const supportScreenOrientationAPI = typeof window.screen.orientation !== "undefined";

// TODO: Need to check if iOS 26.0+ PWA bug is fixed in the future.
//
// Cannot use userAgent to check because it freeze at iOS 26.
// ref: https://www.kochava.com/blog/ios-26-apple-freezes-os-version/
// "notation" is a new option in Intl.PluralRules.prototype.resolvedOptions() in iOS 26.
// https://webkit.org/blog/17333/webkit-features-in-safari-26-0/#web-api
const isIOS26PWA = BrowserUtil.os() === "ios" && "notation" in new Intl.PluralRules().resolvedOptions() && "standalone" in window.navigator && window.navigator.standalone;

export type OrientationType = "portrait" | "landscape";

export type Subscriber = (orientation: OrientationType) => void;

function subscribe(subscriber: Subscriber): () => void {
    const handler = () => subscriber(current());
    if (isIOS26PWA) {
        window.matchMedia("(orientation: portrait)").addEventListener("change", handler);
        return () => window.matchMedia("(orientation: portrait)").removeEventListener("change", handler);
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
        if (isIOS26PWA) {
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
