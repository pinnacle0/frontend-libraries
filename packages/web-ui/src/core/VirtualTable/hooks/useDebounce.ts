import React from "react";

export const useDebounce = function <Param extends any[]>(callback: (...args: Param) => void) {
    const idRef = React.useRef<number>();

    const debounce = () => {
        return function (...args: Param) {
            clearTimeout(idRef.current);
            idRef.current = window.setTimeout(() => {
                callback(...args);
            }, 100);
        };
    };

    React.useEffect(() => () => clearTimeout(idRef.current), []);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callback is not allow to changed
    return React.useMemo(() => debounce(), []);
};
