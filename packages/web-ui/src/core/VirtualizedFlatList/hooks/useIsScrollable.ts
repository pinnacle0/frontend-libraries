import type {DependencyList} from "react";
import React from "react";

export const useIsScrollable = (ref: React.RefObject<HTMLElement>, direction: "vertical" | "horizontal", deps: DependencyList = []) => {
    return React.useMemo(() => {
        if (ref.current) {
            const element = ref.current;
            return direction === "horizontal" ? element.scrollHeight > element.clientHeight : element.scrollWidth > element.clientWidth;
        } else {
            return false;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- any value in deps changed will recalculate the scrollable state of the element
    }, [ref, ...deps]);
};
