import React from "react";
import {useVirtual} from "react-virtual";
import {useTransform} from "../../hooks/useTransform";
import {useLoadingWithDelay} from "./useLoadingWithDelay";
import {useBounceSwipe} from "./hooks/useBounceSwipe";
import {Loading} from "./Loading";
import {Item} from "./Item";
import type {ItemRenderer, FooterData} from "./type";
import "./index.less";

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

    const parentRef = React.useRef<HTMLDivElement>(null);
    const innerContainerRef = React.useRef<HTMLDivElement>(null);
    const startOffsetRef = React.useRef(0);

    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const loadingWithDelay = useLoadingWithDelay(loading, 300);
    const transit = useTransform(innerContainerRef);
    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const listData: Array<T | FooterData> = [
        ...data,
        {loading: loadingWithDelay && loadingType === "loading", ended: !onPullUpLoading, endMessage: endOfListMessage, loadingMessage: pullUpLoadingMessage},
    ];

    const onAutoLoad = () => {
        // if (autoLoad) {
        //     const {overscanStopIndex} = props;
        //     if (overscanStopIndex > data.length - 2 - (typeof autoLoad === "number" ? autoLoad : 3) && !loading && onPullUpLoading) {
        //         setLoadingType("loading");
        //         onPullUpLoading();
        //     }
        // }
    };

    const reset = React.useCallback(() => {
        startOffsetRef.current = 0;
    }, []);

    const handlers = useBounceSwipe({
        axis: "vertical",
        contentRef: parentRef,
        animatedRef: innerContainerRef,
        onStart: ({delta: [, y]}) => {
            startOffsetRef.current = y;
        },
        onEnd: ({delta, boundary}) => {
            if (loadingWithDelay) {
                if (boundary === "upper") {
                    transit.to({
                        y: PULL_DOWN_REFRESH_THRESHOLD,
                    });
                }
            } else {
                if (boundary && Math.abs(startOffsetRef.current - delta[1]) >= PULL_DOWN_REFRESH_THRESHOLD) {
                    boundary === "upper" ? onPullDownRefresh?.() : onPullUpLoading?.();
                    setLoadingType(boundary === "upper" ? "refresh" : "loading");
                }
            }
            reset();
        },
        onCancel: reset,
    });

    const rowVirtualizer = useVirtual({
        size: listData.length,
        parentRef,
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

    return (
        <div className={`g-flat-list-wrapper ${className ?? ""}`} style={style} {...(bounceEffect ? handlers : {})}>
            <div className="inner-container" ref={innerContainerRef} style={contentStyle}>
                <Loading loading={loadingWithDelay && loadingType === "refresh"} message={pullDownRefreshMessage} />
                <div className="list-wrapper" ref={parentRef}>
                    <div
                        className="list"
                        style={{
                            height: rowVirtualizer.totalSize,
                        }}
                    >
                        {rowVirtualizer.virtualItems.map(virtualItem => {
                            return (
                                <div className="g-flat-list-item-wrapper" style={{transform: `translateY(${virtualItem.start}px)`}} ref={virtualItem.measureRef}>
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
