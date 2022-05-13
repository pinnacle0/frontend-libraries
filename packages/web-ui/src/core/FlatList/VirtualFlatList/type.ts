import type React from "react";
import type {FlatListItemProps, FlatListProps} from "../type";

// FlatList related type
export type Measure = (node: HTMLElement | null) => void;

export interface VirtualFlatListHandle {
    measure: () => void;
}

export interface VirtualFlatListProps<T> extends Omit<FlatListProps<T>, "renderItem"> {
    renderItem: ItemRenderer<T>;
    /** Must wrap with React.useCallback */
    estimateSize?: (index: number) => number;
    /** The amount of items to load both behind and ahead of the current window range, default = 3 */
    overscan?: number;
    gap?: {top?: number; bottom?: number; left?: number; right?: number};
    listRef?: React.RefObject<VirtualFlatListHandle>;
}

export interface VirtualFlatListItemProps<T> extends FlatListItemProps<T> {
    measure: Measure;
}

export type ItemRenderer<T> = React.FunctionComponent<VirtualFlatListItemProps<T>>;
