import React from "react";

export const useColumnWidths = (headersRef: React.RefObject<HTMLDivElement>) => {
    const [colWidths, setColWidths] = React.useState<number[]>([]);

    const getColWidths = React.useCallback(() => {
        if (!headersRef.current) return;
        const headers = headersRef.current.querySelectorAll(".table-header");
        const widths: number[] = Array.prototype.slice.call(headers).map(header => {
            const {width} = header.getBoundingClientRect();
            return width;
        });
        setColWidths(widths);
    }, [headersRef]);

    React.useEffect(() => {
        getColWidths();
    }, [getColWidths, headersRef]);

    return {
        getColWidths,
        columnWidths: colWidths,
    };
};
