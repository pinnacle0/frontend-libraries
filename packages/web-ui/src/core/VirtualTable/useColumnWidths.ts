import React from "react";

export const useColumnWidths = (headersRef: React.RefObject<HTMLDivElement>): number[] => {
    const [colWidths, setColWidths] = React.useState<number[]>([]);

    React.useEffect(() => {
        if (!headersRef.current) return;
        const headers = headersRef.current.querySelectorAll(".table-header");
        const widths: number[] = Array.prototype.slice.call(headers).map(header => {
            const {width} = header.getBoundingClientRect();
            return width;
        });
        setColWidths(widths);
    }, [headersRef, setColWidths]);

    return colWidths;
};
