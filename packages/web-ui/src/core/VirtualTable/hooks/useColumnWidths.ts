import React from "react";
import {useForceUpdate} from "../../../hooks/useForceUpdate";
import {useDebounce} from "../../../hooks/useDebounce";

/**
 * VirtualTable is not crated by <table>, the header cell width cannot auto align the body cell width which has large content.
 * So VirtualTable get the columns widths by following steps:
 * 1. Only render the headers with flex style
 * 2. Get the widths of the table headers in ref
 * 3. Calculate the sticky position of the fixed column/header if exists
 * 4. Render the table body columns with the headers widths gotten in step 2
 *
 * If the Virtual Table is render inside a container with open animation e.g. <Modal />,
 * the colWidths may be calculated during the transition and get the wrong width
 * wrap the getColumnWidths function by useDebounce to get the final correct column widths
 */

export const useColumnWidths = () => {
    const headerRef = React.useRef<HTMLDivElement | null>(null);
    const columnWidths = React.useRef<number[]>([]);
    const forceUpdate = useForceUpdate();
    const getColumnWidths = useDebounce(
        React.useCallback(() => {
            if (headerRef.current) {
                const headers = headerRef.current.querySelectorAll(".table-header");
                const widths: number[] = [];
                let columnWidthsUpdate = false;
                headers.forEach((header, index) => {
                    const width = header.getBoundingClientRect().width;
                    if (width > 0 && widths[index] !== width) {
                        widths[index] = width;
                        columnWidthsUpdate = true;
                    }
                });
                if (columnWidthsUpdate) {
                    columnWidths.current = widths;
                    forceUpdate();
                }
            }
        }, [forceUpdate]),
        300
    );

    const getHeaderRef = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (node) {
                headerRef.current = node;
                getColumnWidths();
            }
        },
        [getColumnWidths]
    );

    const handler = React.useCallback(
        (event: TransitionEvent | AnimationEvent | UIEvent) => {
            if (event.target && "querySelector" in event.target && headerRef.current) {
                const element = event.target as HTMLElement;
                const result = element.querySelector(".g-virtual-table");
                result && getColumnWidths();
            }
        },
        [getColumnWidths]
    );

    React.useEffect(() => {
        document.body.addEventListener("resize", handler);
        document.body.addEventListener("transitionend", handler);
        document.body.addEventListener("animationend", handler);
        return () => {
            document.body.removeEventListener("resize", handler);
            document.body.removeEventListener("transitionend", handler);
            document.body.removeEventListener("animationend", handler);
        };
    }, [handler]);

    return {headerRef, getHeaderRef, columnWidths: columnWidths.current};
};
