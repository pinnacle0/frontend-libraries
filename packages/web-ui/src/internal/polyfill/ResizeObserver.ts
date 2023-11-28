import {ResizeObserver} from "@juggle/resize-observer";

declare const window: {
    ResizeObserver?: typeof ResizeObserver;
};

if ("ResizeObserver" in window === false) {
    window.ResizeObserver = ResizeObserver;
}
