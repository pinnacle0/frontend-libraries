/**
 * Orientation detection utility for mobile and desktop devices.
 *
 * Uses the matchMedia API with orientation media queries, which provides
 * reliable cross-platform support including iOS 26+ where the legacy
 * window.orientation API has been removed.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
 */

export type OrientationType = "portrait" | "landscape";

export type Subscriber = (orientation: OrientationType) => void;

function subscribe(subscriber: Subscriber): () => void {
    const handler = () => subscriber(current());
    // Use matchMedia for iOS 26+ and other browsers
    const portraitQuery = window.matchMedia("(orientation: portrait)");
    const mediaHandler = () => handler();

    // Use addEventListener for modern browsers, addListener for older ones
    if (portraitQuery.addEventListener) {
        portraitQuery.addEventListener("change", mediaHandler);
        return () => portraitQuery.removeEventListener("change", mediaHandler);
    } else {
        // Fallback for very old browsers
        portraitQuery.addListener(mediaHandler);
        return () => portraitQuery.removeListener(mediaHandler);
    }
}

function current(): OrientationType {
    try {
        // Use matchMedia API for iOS 26+ and other browsers
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        return isPortrait ? "portrait" : "landscape";
    } catch {
        // Final fallback: compare dimensions
        return window.innerHeight >= window.innerWidth ? "portrait" : "landscape";
    }
}

export const OrientationUtil = Object.freeze({
    subscribe,
    current,
});
