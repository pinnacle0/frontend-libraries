import React from "react";
import {classNames} from "../../util/ClassNames";
import {useTransform} from "../../hooks";
import {useScrollListSwipe} from "./hook/useScrollListSwipe";
import {Content} from "./Content";
import {FloatingLoader} from "./FloatingLoader";
import {Refresh} from "./Refresh";
import type {Boundary, FlatListProps} from "./type";
import "./index.less";
import {useRefreshing} from "./hook/useRefreshing";

export * from "./type";

const PULL_DOWN_REFRESH_THRESHOLD = 50;

export const FlatList = function <T>({
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
}: FlatListProps<T>) {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const animtedRef = React.useRef<HTMLDivElement | null>(null);

    const refreshHeight = React.useRef<number>(0);
    const previousBoundary = React.useRef<Boundary | null>(null);

    const refreshing = useRefreshing(exactRefreshing ?? false, 1000);
    const [showFloatingLoader, setShowFloatingLoader] = React.useState(refreshing);

    const transit = useTransform(animtedRef, {
        timingFunction: "cubic-bezier(0, 0.89, 0.26, 1.02)",
        duration: 800,
    });

    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const bind = useScrollListSwipe({
        scrollElementRef: scrollRef,
        onStart: ({bounary}) => (previousBoundary.current = bounary),
        onMove: ({delta}) => {
            transit.to({y: delta, immediate: true});
        },
        onEnd: ({delta}) => {
            if (previousBoundary.current === "top" && onPullDownRefresh && delta >= PULL_DOWN_REFRESH_THRESHOLD && !refreshing) {
                onPullDownRefresh();
            }
            transit.clear();
            if (refreshing) {
                transit.to({y: refreshHeight.current});
            }
        },
        onCancel: () => {
            transit.clear();
        },
    });

    const updateRefreshHeight = React.useCallback((node: HTMLDivElement | null) => node && (refreshHeight.current = node.getBoundingClientRect().height), []);

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
            <div className="g-flat-list-inner-wrapper" ref={animtedRef} style={wrapperStyle}>
                {exactRefreshing !== undefined && (
                    <React.Fragment>
                        <FloatingLoader show={showFloatingLoader} />
                        <Refresh ref={updateRefreshHeight} refreshing={refreshing} message={pullDownMessage} />
                    </React.Fragment>
                )}
                <div className="g-flat-list-scrollable" ref={scrollRef} style={style}>
                    <Content
                        data={data}
                        rowKey={rowKey}
                        renderItem={renderItem}
                        gap={gap}
                        emptyPlaceholder={emptyPlaceholder}
                        loading={loading}
                        endOfListMessage={endOfListMessage}
                        hasNextPageMessage={pullUpMessage}
                        onPullUpLoading={onPullUpLoading}
                        endReachThreshold={endReachThreshold}
                    />
                </div>
            </div>
        </div>
    );
};
