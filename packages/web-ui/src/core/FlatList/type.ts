import type React from "react";
import type {VariableSizeList} from "react-window";
import type {CellMeasurerCache} from "./CellMeasurerCache";

// CellMeasurer type
export type Measure = () => void;

// FlatList related type
export interface FlatListItemProps<T> {
    data: T;
    index: number;
    measure: Measure;
}

export type ItemRenderer<T> = React.ComponentType<FlatListItemProps<T>>;

export interface ListItemGap {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

export interface FooterData {
    loading: boolean;
    ended: boolean;
    loadingMessage?: string;
    endMessage?: string;
}

export interface ListItemData<T> {
    data: (T | FooterData)[];
    cache: CellMeasurerCache;
    parent: React.RefObject<VariableSizeList>;
    itemRenderer: ItemRenderer<T>;
    gap?: ListItemGap;
}
