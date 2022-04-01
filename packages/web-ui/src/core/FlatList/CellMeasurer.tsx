import React from "react";
import type {VariableSizeList} from "react-window";
import type {CellMeasurerCache} from "./CellMeasurerCache";
import type {Measure} from "./type";

export type RegisterChild = (instance: HTMLElement | null) => void;

export interface CellMeasurerChildProps {
    registerChild: RegisterChild;
    measure: Measure;
}

interface Props {
    rowIndex: number;
    cache: CellMeasurerCache;
    children: React.FunctionComponent<CellMeasurerChildProps>;
    parent: React.RefObject<VariableSizeList>;
}

export function CellMeasurer(props: Props) {
    const {cache, rowIndex, children, parent} = props;
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
            parent.current?.resetAfterIndex(rowIndex);
        }
    }, [cache, parent, calculateSize, rowIndex]);

    const registerChild = (node: HTMLElement | null) => {
        if (node) {
            childRef.current = node;
            const height = calculateSize(node);
            if (!cache.has(rowIndex)) {
                cache.set(height, rowIndex);
                parent.current?.resetAfterIndex(rowIndex);
            }
        } else {
            childRef.current = null;
        }
    };

    return children({registerChild, measure});
}
