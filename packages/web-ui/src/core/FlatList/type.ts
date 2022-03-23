import type React from "react";

// CellMeasurer type
export type Measure = () => void;
export type RegisterChild = (instance: HTMLElement | null) => void;

// FlatList related type
export interface FlatListItemProps<T> {
    data: T;
    index: number;
    measure: Measure;
}

export type ItemRenderer<T> = React.ComponentType<FlatListItemProps<T>>;
