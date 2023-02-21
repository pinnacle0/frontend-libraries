import React from "react";

export function usePrevious<T>(value: T) {
    const ref = React.useRef({
        latest: value,
        previous: value,
    });

    if (value !== ref.current.latest) {
        ref.current = {
            latest: value,
            previous: ref.current.latest,
        };
    }

    return ref.current.previous;
}
