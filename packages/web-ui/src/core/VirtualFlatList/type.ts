import type React from "react";

// FlatList related type
export type Measure = (node: HTMLElement | null) => void;
export interface VirtualizedFlatListItemProps<T> {
    data: T;
    index: number;
    measure: Measure;
}

export type ItemRenderer<T> = React.FunctionComponent<VirtualizedFlatListItemProps<T>>;

export interface FooterData {
    loading: boolean;
    ended: boolean;
    loadingMessage?: string;
    endMessage?: string;
}
