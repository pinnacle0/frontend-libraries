import {ResizeObserver} from "@juggle/resize-observer";

if ("ResizeObserver" in window === false) {
    window.ResizeObserver = ResizeObserver;
}
