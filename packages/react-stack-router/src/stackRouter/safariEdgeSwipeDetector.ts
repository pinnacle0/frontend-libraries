/**
 * Aim at detect popstate event triggered by mobile Safari edge swipe gesture
 *
 * for left edge swipe (back): clientX of touchend event is always be a negative value
 * for right edge swipe (forward): popstate event fired with only touchstart triggered
 *
 * therefore, if there are any popstate event fired within 300ms after above scenarios, it recognized as a native swipe back pop event
 */
export function createSafariEdgeSwipeDetector() {
    let isForwardSwipe = false;
    const isBackwardSwipe = new TimeoutFalseValue(200);

    return {
        get isForwardPop(): boolean {
            return isForwardSwipe;
        },

        get isBackwardPop(): boolean {
            return isBackwardSwipe.value;
        },

        attach(): () => void {
            const start = (event: TouchEvent) => {
                if (Array.from(event.changedTouches).some(touch => window.innerWidth - touch.clientX < 20)) isForwardSwipe = true;
            };
            const end = (event: TouchEvent) => {
                isForwardSwipe = false;
                if (Array.from(event.changedTouches).some(touch => touch.clientX < 0)) isBackwardSwipe.value = true;
            };

            const cancel = () => {
                isForwardSwipe = false;
                isBackwardSwipe.value = false;
            };

            document.addEventListener("touchstart", start);
            document.addEventListener("touchend", end);
            document.addEventListener("cancel", cancel);
            window.addEventListener("popstate", cancel); // reset after popState
            return () => {
                document.removeEventListener("touchstart", start);
                document.removeEventListener("touchend", end);
                document.removeEventListener("cancel", cancel);
                window.removeEventListener("popstate", cancel);
            };
        },
    };
}

/**
 * Automatically turn to false after set true for a given period time
 */
class TimeoutFalseValue {
    private bool = false;

    constructor(private timeout: number) {}

    get value(): boolean {
        return this.bool;
    }

    set value(newValue: boolean) {
        if (newValue) {
            this.bool = true;
            window.setTimeout(() => (this.bool = false), this.timeout);
        } else {
            this.bool = false;
        }
    }
}
