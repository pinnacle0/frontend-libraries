import React from "react";

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(onResize: (rect: DOMRect) => void) {
    const ref = React.useRef<T>(null);

    const observer = React.useMemo(() => new ResizeObserver(entries => onResize(entries[0].contentRect)), [onResize]);

    React.useEffect(() => {
        const current = ref.current;
        if (current === null) return;

        observer.observe(current);

        return () => {
            current && observer.unobserve(current);
            observer.disconnect();
        };
    }, [onResize, observer]);

    return ref;
}
