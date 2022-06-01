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

function mode(): OrientationType {
    try {
        if (!window.screen.orientation && typeof window.orientation !== undefined) {
            return window.orientation === 0 ? "portrait" : "landscape";
        }

        if (window.screen.availHeight > window.screen.availWidth) {
            return "portrait";
        }
        return "landscape";
    } catch (e) {
        return "landscape";
    }
}

function onOrientationChange(callback: () => void): void {
    if (window.screen.orientation?.addEventListener) {
        // some Android browser may not support this method
        window.screen.orientation.addEventListener("change", callback);
    } else {
        window.addEventListener("orientationchange", callback);
    }
}

function removeOnChange(callback: () => void): void {
    if (window.screen.orientation?.removeEventListener) {
        // some Android browser may not support this method
        window.screen.orientation.removeEventListener("change", callback);
    } else {
        window.removeEventListener("orientationchange", callback);
    }
}

export const OrientationUtil = Object.freeze({
    mode,
    onOrientationChange,
    removeOnChange,
});
