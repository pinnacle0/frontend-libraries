import React from "react";

export function usePrevious<T>(value: T) {
    const ref = React.useRef({
        lastest: value,
        previous: value,
    });

    if (value !== ref.current.lastest) {
        ref.current = {
            lastest: value,
            previous: ref.current.lastest,
        };
    }

    return ref.current.previous;
}
