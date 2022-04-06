import React from "react";
import {VariableSizeList} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {Direction, useSwipe} from "../../hooks/useSwipe";
import {useTransition} from "../../hooks/useTransition";
import {useLoadingWithDelay} from "./useLoadingWithDelay";
import {ListItem} from "./ListItem";
import {Loading} from "./Loading";
import {CellMeasurerCache} from "./CellMeasurerCache";
import type {ListItemData, ItemRenderer} from "./type";
import "./index.less";

const LOADING_THRESHOLD = 50;

type Boundary = "upper" | "lower" | null;

export interface Props<T> {
    data: T[];
    renderItem: ItemRenderer<T>;
    pullDownMessage?: string;
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
    swipable?: boolean;
}

export function FlatList<T>(props: Props<T>) {
    const {
        data,
        renderItem,
        pullDownMessage,
        loading = false,
        onPullDownRefresh,
        onPullUpLoading,
        className,
        style,
        emptyPlaceholder,
        contentStyle,
        gap,
        swipable = true,
        autoLoad: autoRefresh = true,
    } = props;

    const [outBounded, setOutBounded] = React.useState<Boundary>(null);

    const listRef = React.useRef<VariableSizeList>(null);
    const outerRef = React.useRef<HTMLElement>(null);
    const innerContainerRef = React.useRef<HTMLDivElement>(null);
    const startOffsetRef = React.useRef(0);
    const prevLoadingBound = React.useRef<Boundary>(null);

    const transit = useTransition(innerContainerRef);
    const loadingWithDelay = useLoadingWithDelay(loading, 1000);

    const cache = React.useMemo(() => new CellMeasurerCache({defaultHeight: 100}), []);

    const isScrollTop = () => {
        return outerRef.current?.scrollTop === 0;
    };

    const isScrollBottom = () => {
        const element = outerRef.current;
        if (element) {
            const {scrollHeight, scrollTop, clientHeight} = element;
            return Math.ceil(scrollTop) + clientHeight >= scrollHeight;
        } else {
            return false;
        }
    };

    const clearSwipe = React.useCallback(() => {
        startOffsetRef.current = 0;
        setOutBounded(null);
    }, []);

    const getOutOfBoundOffset = (y: number): number | null => {
        const offset = y - startOffsetRef.current;
        if (outBounded === "upper") {
            return offset < 0 ? null : offset;
        } else if (outBounded === "lower") {
            return offset > 0 ? null : offset;
        } else {
            return null;
        }
    };

    const listDataItem: ListItemData<T> = React.useMemo(() => ({data, cache, parent: listRef, itemRenderer: renderItem} as ListItemData<T>), [data, cache, renderItem]);

    const handlers = useSwipe(
        {
            onStart: ({delta: [, y], direction}) => {
                startOffsetRef.current = y;
                setOutBounded(direction === Direction.DOWN ? "upper" : "lower");
            },
            onMove: ({delta: [, y], cancel}) => {
                const offset = getOutOfBoundOffset(y);
                if (!offset) {
                    cancel();
                } else {
                    transit.to({
                        y: offset,
                        immediate: true,
                    });
                }
            },
            onEnd: state => {
                if (loadingWithDelay) {
                    transit.to({
                        y: LOADING_THRESHOLD,
                    });
                } else {
                    if (outBounded && Math.abs(startOffsetRef.current - state.delta[1]) >= LOADING_THRESHOLD && !loading) {
                        outBounded === "upper" ? onPullDownRefresh?.() : onPullUpLoading?.();
                        prevLoadingBound.current = outBounded;
                    }
                    transit.clear();
                }

                clearSwipe();
            },
            onCancel: () => {
                transit.clear();
                clearSwipe();
            },
        },
        {
            threshold: ({direction}) => (direction === Direction.DOWN && isScrollTop()) || (direction === Direction.UP && isScrollBottom()),
        }
    );

    React.useEffect(() => {
        listRef.current?.resetAfterIndex(0);
    }, [data]);

    React.useEffect(() => {
        if (loadingWithDelay) {
            transit.to({
                y: LOADING_THRESHOLD,
                immediate: false,
            });
        } else {
            transit.clear();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- transit
    }, [loadingWithDelay]);

    return (
        <div className={`g-flat-list-wrapper ${className ?? ""}`} style={style} {...handlers}>
            <div className={`inner-container${outBounded ? " out-bounded" : ""}`} ref={innerContainerRef} style={contentStyle}>
                <Loading loading={loadingWithDelay} message={pullDownMessage} />
                {data.length !== 0 ? (
                    <AutoSizer>
                        {size => (
                            <VariableSizeList<ListItemData<T>>
                                height={size.height}
                                width={size.width}
                                itemCount={data.length}
                                itemSize={cache.itemSize.bind(cache)}
                                ref={listRef}
                                outerRef={outerRef}
                                itemData={listDataItem}
                                onItemsRendered={() => {}}
                                onScroll={() => transit.clear()}
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
