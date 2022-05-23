export const PULL_DOWN_REFRESH_THRESHOLD = 50;

export type LoadingType = "refresh" | "loading" | null;

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export type ItemRenderer<T> = React.FunctionComponent<FlatListItemProps<T>>;

export type RowKey<T> = (keyof T & string) | ((data: T, index: number) => string) | "index";

export interface FlatListProps<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    rowKey: RowKey<T>;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
    /** When either onPullUpLoading or onPullDownRefresh is given, loading must be given too */
    onPullUpLoading?: () => void;
    onPullDownRefresh?: () => void;
    emptyPlaceholder?: string | React.ReactElement;
    contentStyle?: React.CSSProperties;
    bounceEffect?: boolean;
    hideFooter?: boolean;
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
