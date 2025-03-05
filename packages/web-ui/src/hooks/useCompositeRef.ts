import React from "react";

export function useCompositeRef(...refs: Array<React.RefObject<any> | React.RefCallback<any> | undefined | null>) {
    const refListRef = React.useRef(refs);
    return React.useCallback((node: Node | null) => {
        refListRef.current.forEach(ref => {
            if (!ref) return;
            if (typeof ref === "function") {
                ref(node);
            } else {
                ref.current = node;
            }
        });
    }, []);
}
