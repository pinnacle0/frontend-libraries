import React from "react";
import {defaultRangeExtractor, useVirtual} from "react-virtual";
import {classNames} from "../../../util/ClassNames";
import {useLoadingWithDelay} from "../shared/hooks/useLoadingWithDelay";
import {Wrapper} from "../shared/Wrapper";
import {Footer} from "../shared/Footer";
import {GetRowKey} from "../shared/GetRowKey";
import {Item} from "./Item";
import type {VirtualFlatListProps} from "./type";
import type {Range} from "react-virtual";
import type {FooterData, LoadingType} from "../type";
import "./index.less";

/**
 * VirtualizedFlatList currently only work with item without and size related animation and transition since it break the layout. This will be improve in the future
 */
export const VirtualFlatList = function <T>(props: VirtualFlatListProps<T>) {
    const {
        data,
        renderItem,
        rowKey,
        loading,
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
        hideFooter,
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

    const loadingWithDelay = useLoadingWithDelay(loading ?? false, 300);

    const listData: Array<T | FooterData> = React.useMemo(() => {
        return hideFooter
            ? data
            : [
                  ...data,
                  {
                      loading: loadingWithDelay && loadingType === "loading",
                      ended: !onPullUpLoading,
                      endMessage: endOfListMessage,
                      loadingMessage: pullUpLoadingMessage,
                      __markedAsFooterData: true,
                  } as FooterData,
              ];
    }, [loadingWithDelay, loadingType, endOfListMessage, onPullUpLoading, pullUpLoadingMessage, data, hideFooter]);

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

    React.useEffect(() => {
        if ((loading === undefined || loading === null) && (onPullDownRefresh || onPullUpLoading)) {
            throw new Error("Loading must be specify when given either onPullDownRefresh or onPullUpLoading");
        }
    }, [onPullDownRefresh, onPullUpLoading, loading]);

    // the reason why onScroll event is used to simulate auto loading instead of rangeExtractor is rangeExtractor return a wrong range when on mount
    const onAutoLoad = () => {
        const previousRange = previousRangeRef.current;
        const currentRange = currentRangeRef.current;
        if (
            previousRange &&
            currentRange &&
            autoLoad &&
            onPullUpLoading &&
            !loadingWithDelay &&
            // check going downward
            previousRange.end < currentRange.end &&
            currentRange.end > data.length - 2 - (typeof autoLoad === "number" ? autoLoad : 3)
        ) {
            setLoadingType("loading");
            onPullUpLoading();
        }
    };

    // TODO/Alvis loading more when item can not fill the whole viewport

    return (
        <Wrapper
            className={classNames("g-virtual-flat-list", className)}
            bounceEffect={bounceEffect}
            listWrapperRef={listWrapperRef}
            loadingType={loadingType}
            onLoadingTypeChange={setLoadingType}
            loading={loadingWithDelay}
            onPullDownRefresh={onPullDownRefresh}
            onPullUpLoading={onPullUpLoading}
            innerStyle={contentStyle}
            style={style}
            pullDownRefreshMessage={pullDownRefreshMessage}
            onScroll={onAutoLoad}
        >
            {data.length === 0 ? (
                emptyPlaceholder
            ) : (
                <div className="list" style={{height: rowVirtualizer.totalSize}}>
                    {rowVirtualizer.virtualItems.map(virtualItem => {
                        const data = listData[virtualItem.index];
                        if (listData[virtualItem.index]?.["__markedAsFooterData"] === true) {
                            const {loading, loadingMessage, endMessage, ended} = data as FooterData;
                            return <Footer key={virtualItem.index} loading={loading} ended={ended} loadingMessage={loadingMessage} endMessage={endMessage} measure={virtualItem.measureRef} />;
                        } else {
                            return <Item key={GetRowKey(rowKey, data as T, virtualItem.index)} virtualItem={virtualItem} data={data as T} gap={gap} renderItem={renderItem} />;
                        }
                    })}
                </div>
            )}
        </Wrapper>
    );
};
