import React from "react";
import type {Range} from "react-virtual";
import {defaultRangeExtractor, useVirtual} from "react-virtual";
import {Item} from "./Item";
import type {ItemRenderer} from "./type";
import {Wrapper} from "../shared/Wrapper";
import "./index.less";
import type {FooterData, LoadingType} from "../type";

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

    const parentRef = React.useRef<HTMLDivElement>(null);
    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);
    const currentRangeRef = React.useRef<Range>();
    const previousRangeRef = React.useRef<Range>();

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
            onPullUpLoading();
        }
    };

    const rangeExtractor = React.useCallback((range: Range) => {
        previousRangeRef.current = currentRangeRef.current ?? range;
        currentRangeRef.current = range;
        return defaultRangeExtractor(range);
    }, []);

    const listData: Array<T | FooterData> = React.useMemo(
        () => [...data, {loading: loading && loadingType === "loading", ended: !onPullUpLoading, endMessage: endOfListMessage, loadingMessage: pullUpLoadingMessage}],
        [loading, loadingType, endOfListMessage, onPullUpLoading, pullUpLoadingMessage, data]
    );

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

    // TODO/Alvis loading more when item can not fill the whole viewport

    return (
        <Wrapper
            bounceEffect={bounceEffect}
            contentRef={parentRef}
            loading={loading}
            className="g-virtual-flat-list"
            innerStyle={contentStyle}
            style={style}
            onPullDownRefresh={onPullDownRefresh}
            onPullUpLoading={onPullUpLoading}
            onLoadingTypeChange={setLoadingType}
            pullDownRefreshMessage={pullDownRefreshMessage}
        >
            {data.length === 0 ? (
                emptyPlaceholder
            ) : (
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
            )}
        </Wrapper>
    );
}
