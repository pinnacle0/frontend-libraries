import React from "react";
import type {ListOnItemsRenderedProps} from "react-window";
import {VariableSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {useTransform} from "../../hooks/useTransform";
import {useLoadingWithDelay} from "./useLoadingWithDelay";
import {useBounceSwipe} from "./hooks/useBounceSwipe";
import {ListItem} from "./ListItem";
import {Loading} from "./Loading";
import {CellMeasurerCache} from "./CellMeasurerCache";
import type {ListItemData, ItemRenderer, FooterData} from "./type";
import "./index.less";

type LoadingType = "refresh" | "loading" | null;

const LOADING_THRESHOLD = 50;

export interface Props<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onPullUpLoading?: () => void;
    onPullDownRefresh?: () => void;
    // Automatic load new data when scroll to bottom, a number {X} mean: when to scroll to last {X} items, auto load is going to be triggered
    autoLoad?: boolean | number;
    emptyPlaceholder?: string | React.ReactElement;
    contentStyle?: React.CSSProperties;
    gap?: {top?: number; bottom?: number; left?: number; right?: number};
    bounceEffect?: boolean;
    pullUpLoadingMessage?: string;
    endOfListMessage?: string;
    pullDownRefreshMessage?: string;
}

/**
 * VirtualizedFlatList currently only work with item without and size related animation and transition since it break the layout. This will be improve in the future
 */
export function VirtualizedFlatList<T>(props: Props<T>) {
    const {
        data,
        renderItem,
        loading = false,
        className,
        style,
        onPullDownRefresh,
        onPullUpLoading,
        emptyPlaceholder,
        contentStyle,
        gap,
        autoLoad = true,
        bounceEffect = true,
        pullUpLoadingMessage,
        endOfListMessage,
        pullDownRefreshMessage,
    } = props;

    const [loadingType, setLoadingType] = React.useState<"refresh" | "loading" | null>(null);

    const listRef = React.useRef<VariableSizeList>(null);
    const listOuterRef = React.useRef<HTMLElement>(null);
    const innerContainerRef = React.useRef<HTMLDivElement>(null);
    const startOffsetRef = React.useRef(0);

    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const transit = useTransform(innerContainerRef);
    const loadingWithDelay = useLoadingWithDelay(loading, 300);

    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 100}), []);

    const newData: Array<T | FooterData> = [
        ...data,
        {loading: loadingWithDelay && loadingType === "loading", ended: !onPullUpLoading, endMessage: endOfListMessage, loadingMessage: pullUpLoadingMessage},
    ];
    const listDataItem = {data: newData, cache, parent: listRef, itemRenderer: renderItem, gap};

    const reset = React.useCallback(() => {
        startOffsetRef.current = 0;
    }, []);

    const onAutoLoad = (props: ListOnItemsRenderedProps) => {
        if (autoLoad) {
            const {overscanStopIndex} = props;
            if (overscanStopIndex > data.length - 2 - (typeof autoLoad === "number" ? autoLoad : 3) && !loading && onPullUpLoading) {
                setLoadingType("loading");
                onPullUpLoading();
            }
        }
    };

    const handlers = useBounceSwipe({
        axis: "vertical",
        contentRef: listOuterRef,
        animatedRef: innerContainerRef,
        isScrollable: true,
        onStart: ({delta: [, y]}) => {
            startOffsetRef.current = y;
        },
        onEnd: ({delta, boundary}) => {
            if (loadingWithDelay) {
                if (boundary === "upper") {
                    transit.to({
                        y: LOADING_THRESHOLD,
                    });
                }
            } else {
                if (boundary && Math.abs(startOffsetRef.current - delta[1]) >= LOADING_THRESHOLD) {
                    boundary === "upper" ? onPullDownRefresh?.() : onPullUpLoading?.();
                    setLoadingType(boundary === "upper" ? "refresh" : "loading");
                }
                transit.clear();
            }
            reset();
        },
        onCancel: reset,
    });

    React.useEffect(() => {
        listRef.current?.resetAfterIndex(0);
    }, [data]);

    React.useEffect(() => {
        if (loadingWithDelay) {
            if (loadingTypeRef.current === "refresh") {
                transit.to({
                    y: LOADING_THRESHOLD,
                    immediate: false,
                });
            }
        } else {
            transit.clear();
            setLoadingType(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- transit
    }, [loadingWithDelay]);

    return (
        <div className={`g-flat-list-wrapper ${className ?? ""}`} style={style} {...(bounceEffect ? handlers : {})}>
            <div className="inner-container" ref={innerContainerRef} style={contentStyle}>
                <Loading loading={loadingWithDelay && loadingType === "refresh"} message={pullDownRefreshMessage} />
                {data.length !== 0 ? (
                    <AutoSizer>
                        {size => (
                            <VariableSizeList<ListItemData<T>>
                                height={size.height}
                                width={size.width}
                                itemCount={listDataItem.data.length}
                                itemSize={cache.itemSize.bind(cache)}
                                ref={listRef}
                                outerRef={listOuterRef}
                                itemData={listDataItem}
                                onItemsRendered={onAutoLoad}
                                onScroll={reset}
                            >
                                {ListItem}
                            </VariableSizeList>
                        )}
                    </AutoSizer>
                ) : (
                    emptyPlaceholder
                )}
            </div>
        </div>
    );
}
