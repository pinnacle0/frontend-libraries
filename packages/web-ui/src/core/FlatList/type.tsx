export const PULL_DOWN_REFRESH_THRESHOLD = 50;

export type LoadingType = "refresh" | "loading" | null;

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export type Gap =
    | {
          top?: number;
          bottom?: number;
          left?: number;
          right?: number;
      }
    | number;
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
    gap?: Gap;
    pullDownRefreshMessage?: React.ReactElement | string;
    pullDownRefreshingMessage?: React.ReactElement | string;
    pullUpLoadMoreMessage?: React.ReactElement | string;
    pullUpLoadingMessage?: React.ReactElement | string;
    endOfListMessage?: React.ReactElement | string;
}

export interface FlatListItemProps<T> {
    data: T;
    index: number;
}

export interface FooterData {
    __markedAsFooterData: true;
    loading: boolean;
    ended: boolean;
    loadMoreMessage?: React.ReactElement | string;
    loadingMessage?: React.ReactElement | string;
    endMessage?: React.ReactElement | string;
}
