import React from "react";
import type {CellMeasurerCache} from "./CellMeasurerCache";
import type {Measure, RegisterChild} from "./type";

interface CellMeasurerChildrenProps {
    registerChild: RegisterChild;
    measure: Measure;
}

interface Props<T> {
    onSizeReset: (rwoIndex: number) => void;
    rowIndex: number;
    cache: CellMeasurerCache;
    children: React.FunctionComponent<CellMeasurerChildrenProps>;
}

export function CellMeasurer<T>(props: Props<T>) {
    const {cache, rowIndex, children, onSizeReset} = props;
    const childRef = React.useRef<HTMLElement | null>();

    const calculateSize = React.useCallback((node: HTMLElement): number => {
        const originalStyleHeight = node.style.height;
        node.style.height = "auto";
        const {height} = node.getBoundingClientRect();
        node.style.height = originalStyleHeight;
        return height;
    }, []);

    const measure: Measure = React.useCallback(() => {
        if (childRef.current) {
            const height = calculateSize(childRef.current);

            cache.set(height, rowIndex);
            onSizeReset(rowIndex);
        }
    }, [cache, onSizeReset, calculateSize, rowIndex]);

    const registerChild = (node: HTMLElement | null) => {
        if (node) {
            childRef.current = node;
            const height = calculateSize(node);
            if (!cache.has(rowIndex)) {
                cache.set(height, rowIndex);

                onSizeReset(rowIndex);
            }
        } else {
            childRef.current = null;
        }
    };

    return children({registerChild, measure});
}
