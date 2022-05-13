export const PULL_DOWN_REFRESH_THRESHOLD = 50;

export type LoadingType = "refresh" | "loading" | null;

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export type ItemRenderer<T> = React.FunctionComponent<FlatListItemProps<T>>;

export interface FlatListProps<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onPullUpLoading?: () => void;
    onPullDownRefresh?: () => void;
    /** Automatic load new data when scroll to bottom, a number {X} mean: when to scroll to last {X} items, auto load is going to be triggered */
    autoLoad?: boolean | number;
    emptyPlaceholder?: string | React.ReactElement;
    contentStyle?: React.CSSProperties;
    bounceEffect?: boolean;
    pullUpLoadingMessage?: string;
    endOfListMessage?: string;
    pullDownRefreshMessage?: string;
}

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export interface FooterData {
    loading: boolean;
    ended: boolean;
    loadingMessage?: string;
    endMessage?: string;
}
