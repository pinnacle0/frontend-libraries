/**
 * 1)
 * This util only works on mobile devices.
 * 2)
 * For Safari Mobile & Iphone Mobile,
 * ScreenOrientation API is not supported, and screen.availHeight & screen.availWidth will not produce a good result.
 * So use old APIs: window.eventListener, 'orientationchange'.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/orientationchange_event
 */

export type OrientationType = "portrait" | "landscape";

export type Subscriber = (orientation: OrientationType) => void;

const supportScreenOrientationAPI = typeof window.screen.orientation !== "undefined";

function subscribe(subscriber: Subscriber): () => void {
    const handler = () => subscriber(current());
    if (supportScreenOrientationAPI) {
        window.screen.orientation.addEventListener("change", handler);
        return () => window.screen.orientation.removeEventListener("change", handler);
    } else {
        window.addEventListener("orientationchange", handler);
        return () => window.removeEventListener("orientationchange", handler, false);
    }
}

function current(): OrientationType {
    try {
        if (supportScreenOrientationAPI) {
            return window.screen.orientation.angle === 0 ? "portrait" : "landscape";
        } else {
            return window.orientation === 0 ? "portrait" : "landscape";
        }
    } catch {
        return "portrait";
    }
}

export const OrientationUtil = Object.freeze({
    subscribe,
    current,
});
