import React from "react";
import classNames from "classnames";
import {defaultRangeExtractor, useVirtual} from "react-virtual";
import {Wrapper} from "../shared/Wrapper";
import {Item} from "./Item";
import "./index.less";
import type {VirtualFlatListProps} from "./type";
import type {Range} from "react-virtual";
import type {FooterData, LoadingType} from "../type";

/**
 * VirtualizedFlatList currently only work with item without and size related animation and transition since it break the layout. This will be improve in the future
 */
export const VirtualFlatList = function <T>(props: VirtualFlatListProps<T>) {
    const {
        data,
        renderItem,
        loading = false,
        bounceEffect = true,
        className,
        style,
        onPullDownRefresh,
        onPullUpLoading,
        emptyPlaceholder,
        contentStyle,
        gap,
        autoLoad = true,
        overscan = 3,
        estimateSize,
        listRef,
        pullUpLoadingMessage,
        endOfListMessage,
        pullDownRefreshMessage,
    } = props;

    const listWrapperRef = React.useRef<HTMLDivElement>(null);
    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);
    const currentRangeRef = React.useRef<Range>();
    const previousRangeRef = React.useRef<Range>();

    const listData: Array<T | FooterData> = React.useMemo(
        () => [...data, {loading: loading && loadingType === "loading", ended: !onPullUpLoading, endMessage: endOfListMessage, loadingMessage: pullUpLoadingMessage}],
        [loading, loadingType, endOfListMessage, onPullUpLoading, pullUpLoadingMessage, data]
    );

    const rangeExtractor = React.useCallback((range: Range) => {
        previousRangeRef.current = currentRangeRef.current ?? range;
        currentRangeRef.current = range;
        return defaultRangeExtractor(range);
    }, []);

    const rowVirtualizer = useVirtual({
        size: listData.length,
        parentRef: listWrapperRef,
        overscan,
        estimateSize,
        rangeExtractor,
    });
    const rowVirtualizerRef = React.useRef(rowVirtualizer);
    rowVirtualizerRef.current = rowVirtualizer;

    React.useImperativeHandle(listRef, () => ({
        measure: rowVirtualizer.measure,
    }));

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

    // TODO/Alvis loading more when item can not fill the whole viewport

    return (
        <Wrapper
            className={classNames("g-virtual-flat-list", className)}
            bounceEffect={bounceEffect}
            listWrapperRef={listWrapperRef}
            loading={loading}
            innerStyle={contentStyle}
            style={style}
            onPullDownRefresh={onPullDownRefresh}
            onPullUpLoading={onPullUpLoading}
            pullDownRefreshMessage={pullDownRefreshMessage}
            onScroll={onAutoLoad}
            onLoadingTypeChange={setLoadingType}
        >
            {data.length === 0 ? (
                emptyPlaceholder
            ) : (
                <div className="list" style={{height: rowVirtualizer.totalSize}}>
                    {rowVirtualizer.virtualItems.map(virtualItem => {
                        return (
                            <div key={virtualItem.index} className="g-virtual-flat-list-item-wrapper" style={{transform: `translateY(${virtualItem.start}px)`}} ref={virtualItem.measureRef}>
                                <Item data={listData} index={virtualItem.index} itemRenderer={renderItem} measure={virtualItem.measureRef} gap={gap} />
                            </div>
                        );
                    })}
                </div>
            )}
        </Wrapper>
    );
};
