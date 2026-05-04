import React from "react";
import {classNames} from "../../util/ClassNames";
import {useTransform} from "../../hooks/useTransform";
import {useScrollListSwipe} from "./hook/useScrollListSwipe";
import {Content} from "./Content";
import {Footer} from "./Content/Footer";
import {FloatingLoader} from "./FloatingLoader";
import {Refresh} from "./Refresh";
import type {Boundary, FlatListProps} from "./type";
import {useRefreshing} from "./hook/useRefreshing";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";
import {VirtualList} from "../VirtualList";
import type {VirtualItem} from "@tanstack/react-virtual";
import {usePaddingGap} from "./useGap";

export * from "./type";

const PULL_DOWN_REFRESH_THRESHOLD = 50;

export const FlatList = ReactUtil.memo(
    "FlatList",
    <T extends object>({
        renderItem,
        data,
        rowKey,
        id,
        className,
        gap,
        refreshing: exactRefreshing,
        loading,
        onPullDownRefresh,
        onPullUpLoading,
        endReachThreshold,
        emptyPlaceholder,
        pullDownMessage,
        pullUpMessage,
        endOfListMessage,
        style,
        wrapperStyle,
        virtual,
        virtualItemSize,
        virtualOverscan,
        virtualInitialRect,
        virtualListRef,
    }: FlatListProps<T>) => {
        const refreshing = useRefreshing(exactRefreshing ?? false, 1000);
        const [showFloatingLoader, setShowFloatingLoader] = React.useState(refreshing);

        const scrollRef = React.useRef<HTMLDivElement | null>(null);
        const animatedRef = React.useRef<HTMLDivElement | null>(null);

        const refreshHeight = React.useRef<number>(0);
        const previousBoundary = React.useRef<Boundary | null>(null);

        const transit = useTransform(animatedRef, {
            timingFunction: "cubic-bezier(0, 0.89, 0.26, 1.02)",
            duration: 800,
        });
        const transitRef = React.useRef(transit);

        React.useEffect(() => {
            transitRef.current = transit;
        }, [transit]);

        const bind = useScrollListSwipe({
            scrollElementRef: scrollRef,
            onStart: ({boundary}) => {
                setShowFloatingLoader(false);
                previousBoundary.current = boundary;
            },
            onMove: ({delta}) => transit.to({y: delta, immediate: true}),
            onEnd: ({delta}) => {
                if (previousBoundary.current === "top" && onPullDownRefresh && delta >= PULL_DOWN_REFRESH_THRESHOLD && !refreshing && !loading) {
                    onPullDownRefresh();
                }
                transit.clear();
                if (refreshing) {
                    transit.to({y: refreshHeight.current});
                }
            },
            onCancel: () => transit.clear(),
        });

        const updateRefreshHeight = React.useCallback((node: HTMLDivElement | null) => {
            node && (refreshHeight.current = node.getBoundingClientRect().height);
        }, []);

        const handleScroll = () => {
            transit.clear();
            refreshing && setShowFloatingLoader(true);
        };

        const virtualItemStyle = usePaddingGap(gap);
        const loadedData = React.useRef<T[] | null>(null);
        const onPullUpLoadingRef = React.useRef(onPullUpLoading);
        onPullUpLoadingRef.current = !exactRefreshing ? onPullUpLoading : undefined;

        const handleVirtualItemsChange = React.useCallback(
            (virtualItems: VirtualItem[]) => {
                if (!onPullUpLoadingRef.current || data.length === 0) return;

                const lastVirtualItem = virtualItems[virtualItems.length - 1];
                if (!lastVirtualItem || lastVirtualItem.index < data.length - (endReachThreshold ?? 4)) return;

                if (loadedData.current === data) return;
                loadedData.current = data;
                onPullUpLoadingRef.current();
            },
            [data, endReachThreshold]
        );

        React.useEffect(() => {
            if (refreshing) {
                if (previousBoundary.current === "top") {
                    transitRef.current.to({y: refreshHeight.current});
                } else {
                    setShowFloatingLoader(true);
                }
            } else {
                previousBoundary.current = null;
                transitRef.current.clear();
                setShowFloatingLoader(false);
            }
        }, [refreshing]);

        return (
            <div id={id} className={classNames("g-flat-list", className)} {...bind}>
                <div className="g-flat-list-inner-wrapper" ref={animatedRef} style={wrapperStyle}>
                    {exactRefreshing !== undefined && (
                        <React.Fragment>
                            <FloatingLoader show={showFloatingLoader} />
                            <Refresh ref={updateRefreshHeight} refreshing={refreshing} message={pullDownMessage} />
                        </React.Fragment>
                    )}
                    {virtual ? (
                        data.length === 0 && emptyPlaceholder ? (
                            <div className="g-flat-list-scrollable" ref={scrollRef} style={style} onScroll={handleScroll}>
                                <div className="g-flat-list-content">{emptyPlaceholder}</div>
                            </div>
                        ) : (
                            <VirtualList
                                data={data}
                                rowKey={rowKey}
                                renderItem={renderItem}
                                fixedSize={virtualItemSize}
                                overscan={virtualOverscan}
                                initialRect={virtualInitialRect}
                                listRef={virtualListRef}
                                className="g-flat-list-scrollable g-flat-list-virtual-scrollable"
                                innerClassName="g-flat-list-virtual-content"
                                itemWrapperClassName="g-flat-list-item"
                                itemWrapperStyle={virtualItemStyle}
                                style={style}
                                scrollRef={scrollRef}
                                onScroll={handleScroll}
                                onVirtualItemsChange={handleVirtualItemsChange}
                                footerSize={50}
                                footer={
                                    data.length > 0 ? (
                                        <Footer
                                            loading={loading}
                                            hasNextPage={!exactRefreshing && onPullUpLoading !== undefined}
                                            endOfListMessage={endOfListMessage}
                                            hasNextPageMessage={pullUpMessage}
                                        />
                                    ) : undefined
                                }
                            />
                        )
                    ) : (
                        <div className="g-flat-list-scrollable" ref={scrollRef} style={style} onScroll={handleScroll}>
                            <Content
                                data={data}
                                rowKey={rowKey}
                                renderItem={renderItem}
                                gap={gap}
                                emptyPlaceholder={emptyPlaceholder}
                                loading={loading}
                                endOfListMessage={endOfListMessage}
                                hasNextPageMessage={pullUpMessage}
                                onPullUpLoading={!exactRefreshing ? onPullUpLoading : undefined}
                                endReachThreshold={endReachThreshold}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
