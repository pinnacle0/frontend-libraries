import React from "react";

export function useResizeObserver(onResize: (rect: DOMRect) => void) {
    const ref = React.useRef<HTMLDivElement>(null);

    const observer = React.useMemo(
        () =>
            new ResizeObserver(entries => {
                onResize(entries[0].contentRect);
            }),
        [onResize]
    );

    React.useEffect(() => {
        const current = ref.current;

        if (current !== null) {
            observer.observe(current);
        }

        return () => {
            if (current !== null) {
                observer.unobserve(current);
            }
            observer.disconnect();
        };
    }, [observer]);

    return ref;
}
