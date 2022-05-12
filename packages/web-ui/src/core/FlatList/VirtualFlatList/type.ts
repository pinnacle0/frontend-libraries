import type React from "react";
import type {FlatListItemProps} from "../type";

// FlatList related type
export type Measure = (node: HTMLElement | null) => void;

export interface VirtualFlatListProps<T> extends FlatListItemProps<T> {
    //  The amount of items to load both behind and ahead of the current window range, default = 3
    overscan?: number;
    gap?: {top?: number; bottom?: number; left?: number; right?: number};
    renderItem: ItemRenderer<T>;
}

export interface VirtualFlatListItemProps<T> extends FlatListItemProps<T> {
    measure: Measure;
}

export type ItemRenderer<T> = React.FunctionComponent<VirtualFlatListItemProps<T>>;
