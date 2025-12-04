import React from "react";
import {useResizeObserver} from "../useResizeObserver";

export function useParentResizeObserver<T extends HTMLElement = HTMLDivElement>(onResize: (parentRect: DOMRect, parentRef: HTMLElement) => void) {
    const ref = React.useRef<T>(null);

    const onParentResize = React.useCallback(
        (parentRect: DOMRect) => {
            const parent = ref.current?.parentElement;
            if (parent) onResize(parentRect, parent);
        },
        [onResize]
    );

    const parentRef = useResizeObserver<HTMLElement>(onParentResize);

    // Need to run before useResizeObserver's useEffect
    React.useLayoutEffect(() => {
        const parent = ref.current?.parentElement;
        if (parent) parentRef.current = parent;
    }, [parentRef]);

    return ref;
}
