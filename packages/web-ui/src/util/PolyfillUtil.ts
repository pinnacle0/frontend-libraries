import {ResizeObserver} from "@juggle/resize-observer"

export class PolyfillUtil {
    static ResizeObserver() {
        if ("ResizeObserver" in window === false) {
            window.ResizeObserver = ResizeObserver
        }
    }
}
