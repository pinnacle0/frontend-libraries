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

export interface ListItemData<T> {
    data: T[];
    cache: CellMeasurerCache;
    parent: React.RefObject<VariableSizeList>;
    itemRenderer: ItemRenderer<T>;
}
