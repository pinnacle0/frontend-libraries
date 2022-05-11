import React from "react";

/**
 *
 * If the Virtual Table is render inside a container with open animation e.g. <Modal />,
 * the colWidths may be calculated during the transition and get the wrong width with useState & useEffect
 * useLayoutEffect will be trigged in the transition process and get the final correct column widths
 */

export const useColumnWidths = (headersRef: React.RefObject<HTMLDivElement>) => {
    const [colWidths, setColWidths] = React.useState<number[]>([]);

    const calculateColWidths = React.useCallback(() => {
        if (!headersRef.current) return;
        const headers = headersRef.current.querySelectorAll(".table-header");
        const widths: number[] = Array.prototype.slice.call(headers).map(header => {
            const {width} = header.getBoundingClientRect();
            return width;
        });
        setColWidths(widths);
    }, [headersRef]);

    return {columnWidths: colWidths, calculateColWidths};
};
