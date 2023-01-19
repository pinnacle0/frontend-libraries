/**
 * Aim at detect popstate event tirggered by Safari edge swipe gesture
 * for left edge swipe (back): clientX of touchend event is always be a native value
 * for right edge swipe (forward): popstate event fired with only touchstart triggered
 * therefore, if there are any popstate event fired within 300ms after above scenarios, it recognized as a native swipe back pop event
 */
export function createSafariEdgeSwipeDetector() {
    let isForwordSwipe = false;
    const isBackwardSwipe = new TimeoutFalseValue(200);

    return {
        get isForwardPop(): boolean {
            return isForwordSwipe;
        },

        get isBackwardPop(): boolean {
            return isBackwardSwipe.value;
        },

        attach(): () => void {
            const start = (event: TouchEvent) => {
                if (Array.from(event.changedTouches).some(touch => window.innerWidth - touch.clientX < 20)) isForwordSwipe = true;
            };
            const end = (event: TouchEvent) => {
                isForwordSwipe = false;
                if (Array.from(event.changedTouches).some(touch => touch.clientX < 0)) isBackwardSwipe.value = true;
            };

            const cancel = () => {
                isForwordSwipe = false;
                isBackwardSwipe.value = false;
            };

            document.addEventListener("touchstart", start);
            document.addEventListener("touchend", end);
            document.addEventListener("cancel", cancel);
            return () => {
                document.removeEventListener("touchstart", start);
                document.removeEventListener("touchend", end);
                document.removeEventListener("cancel", cancel, true);
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
            setTimeout(() => (this.bool = false), this.timeout);
        } else {
            this.bool = false;
        }
    }
}
