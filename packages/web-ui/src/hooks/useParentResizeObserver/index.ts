import React from "react";
import {useResizeObserver} from "../useResizeObserver";

export function useParentResizeObserver<T extends HTMLElement = HTMLDivElement>(ref: React.RefObject<T | null>, onResize: (parentRect: DOMRect, parentRef: HTMLElement) => void) {
    const onParentResize = React.useCallback(
        (parentRect: DOMRect) => {
            const parent = ref.current?.parentElement;
            if (parent) onResize(parentRect, parent);
        },
        [onResize, ref]
    );

    const parentRef = useResizeObserver<HTMLElement>(onParentResize);

    // Need to run before useResizeObserver's useEffect
    React.useLayoutEffect(() => {
        const parent = ref.current?.parentElement;
        if (parent) parentRef.current = parent;
    }, [ref, parentRef]);
}
