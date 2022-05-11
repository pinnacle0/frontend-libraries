import React from "react";
import type {Range} from "react-virtual";
import {defaultRangeExtractor, useVirtual} from "react-virtual";
import {useTransform} from "../../hooks/useTransform";
import {useLoadingWithDelay} from "./useLoadingWithDelay";
import {useBounceSwipe} from "./hooks/useBounceSwipe";
import {Loading} from "./Loading";
import {Item} from "./Item";
import type {ItemRenderer, FooterData} from "./type";
import "./index.less";
import {useElementScrollState} from "./hooks/useElementScrollState";
import {Direction} from "../../hooks/useSwipe";

type LoadingType = "refresh" | "loading" | null;

const PULL_DOWN_REFRESH_THRESHOLD = 50;

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
    //  The amount of items to load both behind and ahead of the current window range, default = 3
    overscan?: number;
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
export function VirtualFlatList<T>(props: Props<T>) {
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
        overscan = 3,
        bounceEffect = true,
        pullUpLoadingMessage,
        endOfListMessage,
        pullDownRefreshMessage,
    } = props;

    const [loadingType, setLoadingType] = React.useState<"refresh" | "loading" | null>(null);

    const parentRef = React.useRef<HTMLDivElement>(null);
    const animatedRef = React.useRef<HTMLDivElement>(null);
    const startOffsetRef = React.useRef(0);
    const currentRangeRef = React.useRef<Range>();
    const previousRangeRef = React.useRef<Range>();
    const {isScrollable} = useElementScrollState(parentRef);

    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const loadingWithDelay = useLoadingWithDelay(loading, 300);
    const transit = useTransform(animatedRef);
    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const listData: Array<T | FooterData> = [
        ...data,
        {loading: loadingWithDelay && loadingType === "loading", ended: !onPullUpLoading, endMessage: endOfListMessage, loadingMessage: pullUpLoadingMessage},
    ];

    // the reason why onScroll event is used to simulate auto loading instead of rangeExtractor is rangeExtractor return a wrong range when on mount
    const onAutoLoad = () => {
        const previousRange = previousRangeRef.current;
        const currentRange = currentRangeRef.current;
        if (
            previousRange &&
            currentRange &&
            autoLoad &&
            onPullUpLoading &&
            !loading &&
            // check going downward
            previousRange.end < currentRange.end &&
            currentRange.end > data.length - 2 - (typeof autoLoad === "number" ? autoLoad : 3)
        ) {
            setLoadingType("loading");
            onPullUpLoading();
        }
    };

    const reset = React.useCallback(() => {
        startOffsetRef.current = 0;
    }, []);

    const handlers = useBounceSwipe({
        axis: "vertical",
        contentRef: parentRef,
        animatedRef,
        onStart: ({delta: [, y]}) => {
            startOffsetRef.current = y;
        },
        onEnd: ({delta, direction, boundary}) => {
            if (loadingWithDelay) {
                if (boundary !== "upper") {
                    transit.to({
                        y: PULL_DOWN_REFRESH_THRESHOLD,
                    });
                }
            } else {
                if (Math.abs(startOffsetRef.current - delta[1]) >= PULL_DOWN_REFRESH_THRESHOLD) {
                    const scrollable = isScrollable("vertical");
                    if (boundary === "upper" || (!scrollable && direction === Direction.DOWN)) {
                        setLoadingType("refresh");
                        onPullDownRefresh?.();
                    } else {
                        setLoadingType("loading");
                        onPullUpLoading?.();
                    }
                }
            }
            reset();
        },
        onCancel: reset,
    });

    const rangeExtractor = React.useCallback((range: Range) => {
        previousRangeRef.current = currentRangeRef.current ?? range;
        currentRangeRef.current = range;
        return defaultRangeExtractor(range);
    }, []);

    const rowVirtualizer = useVirtual({
        size: listData.length,
        parentRef,
        overscan,
        rangeExtractor,
    });
    const rowVirtualizerRef = React.useRef(rowVirtualizer);
    rowVirtualizerRef.current = rowVirtualizer;

    React.useEffect(() => {
        rowVirtualizerRef.current.measure();
    }, [data]);

    React.useEffect(() => {
        if (loadingWithDelay) {
            if (loadingTypeRef.current === "refresh") {
                transitRef.current.to({
                    y: PULL_DOWN_REFRESH_THRESHOLD,
                    immediate: false,
                });
            }
        } else {
            transitRef.current.clear();
            setLoadingType(null);
        }
    }, [loadingWithDelay]);

    // TODO/Alvis loading more when item can not fill the whole viewport

    return (
        <div className={`g-virtual-flat-list ${className ?? ""}`} style={style} {...(bounceEffect ? handlers : {})}>
            <div className="inner-container" ref={animatedRef} style={contentStyle}>
                <Loading loading={loadingWithDelay && loadingType === "refresh"} message={pullDownRefreshMessage} />
                <div className="list-wrapper" ref={parentRef} onScroll={onAutoLoad}>
                    <div className="list" style={{height: rowVirtualizer.totalSize}}>
                        {rowVirtualizer.virtualItems.map(virtualItem => {
                            return (
                                <div key={virtualItem.index} className="g-virtual-flat-list-item-wrapper" style={{transform: `translateY(${virtualItem.start}px)`}} ref={virtualItem.measureRef}>
                                    <Item data={listData} index={virtualItem.index} itemRenderer={renderItem} measure={virtualItem.measureRef} gap={gap} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
