import type React from "react";

export type Boundary = "top" | "bottom";

export type Gap =
    | number
    | [number, number]
    | {
          top?: number;
          bottom?: number;
          left?: number;
          right?: number;
      };

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export interface FlatListProps<T> {
    /**
     * List of data to show in the list
     */
    data: T[];
    /**
     * Specify key for each `item` using Object key of type `T`
     */
    rowKey: keyof T | "index";
    /**
     * A component render for each item
     */
    renderItem: React.ComponentType<FlatListItemProps<T>>;
    /**
     * Set this to true when waiting for new data by pull down refresh
     */
    refreshing?: boolean;
    /**
     * Set this to true when waiting for new data by pull down refresh
     */
    loading?: boolean;
    /**
     * If Provided, `Refresh` component will be loaded into the FlatList, you can also specify your own Refresh component using `refresh` props
     */
    onPullDownRefresh?: () => void;
    /**
     * If Provided, `Footer` component will be loaded into the FlatList, you can also specify your own Refresh component using `footer` props
     */
    onPullUpLoading?: () => void;
    /**
     * If Provided, Element will be shown when `data` is a empty array
     */
    emptyPlaceholder?: string | React.ReactElement;
    /**
     * `pullUpMessage` will be show in `Refresh` only if `onPullDownRefresh` is defined
     * if Provided, this message will replace the pull down message in `Refresh`
     */
    pullDownMessage?: string;
    /**
     * `pullUpMessage` will be show in `Footer` only if `onPullUpLoading` is defined
     * if Provided, this message will replace end of list message in `Footer`
     */
    pullUpMessage?: string;
    /**
     * if Provided, this message will replace end of list message in `Footer`
     */
    endOfListMessage?: string;
    /**
     * Set margin for each item
     */
    gap?: Gap;
    /**
     * Determine number of items left outside of viewport of the list to trigger onPullUpLoading
     * Default: 4
     */
    endReachThreshold?: number;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
    wrapperStyle?: React.CSSProperties;
}
