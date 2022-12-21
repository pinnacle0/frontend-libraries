import React from "react";
import {classNames} from "../../util/ClassNames";
import {Direction} from "../../hooks/useSwipe";
import {useSwipe, useTransform} from "../../hooks";
import {getBounaryFromStartDirection, isExceededBounary, isScrollBottom, isScrollTop} from "./util";
import {Content} from "./Content";
import type {Boundary, FlatListProps} from "./type";
import type {SwipeState} from "../../hooks/useSwipe";
import "./index.less";
import {Loader} from "./Loader";

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
}: FlatListProps<T>) {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const animtedRef = React.useRef<HTMLDivElement | null>(null);

    const refreshHeight = React.useRef<number>(0);
    const previousBoundary = React.useRef<Boundary | null>(null);
    const [startDelta, setStartDelta] = React.useState<number | null>(null);
    const delayedRefreshing = useRefreshing(exactRefreshing ?? false, 1000);

    const transit = useTransform(animtedRef, {
        timingFunction: "cubic-bezier(0, 0.89, 0.26, 1.02)",
        duration: 800,
    });

    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const threshold = ({direction}: SwipeState): boolean => {
        const element = scrollRef.current;
        if (!element) return false;
        if (direction === Direction.DOWN && isScrollTop(element)) {
            return true;
        } else if (direction === Direction.UP && isScrollBottom(element)) {
            return true;
        }
        return false;
    };

    const clear = () => {
        transit.clear();
        setStartDelta(null);
    };

    const bind = useSwipe(
        {
            onStart: ({delta: [, y], direction}) => {
                setStartDelta(y);
                previousBoundary.current = getBounaryFromStartDirection(direction);
            },
            onMove: ({delta: [, y], cancel}) => {
                if (!startDelta || !previousBoundary.current) return;
                const transform = y - startDelta;
                transit.to({y: transform, immediate: true});
                isExceededBounary(transform, previousBoundary.current) && cancel();
            },
            onEnd: ({delta: [, y]}: SwipeState) => {
                if (!startDelta) return;
                if (previousBoundary.current === "top" && onPullDownRefresh && y - startDelta >= PULL_DOWN_REFRESH_THRESHOLD && !delayedRefreshing) {
                    onPullDownRefresh();
                }
                clear();
                if (delayedRefreshing) {
                    transit.to({y: refreshHeight.current});
                }
            },
            onCancel: clear,
        },
        {threshold, preventDefault: true, stopPropagation: true}
    );

    const onScroll = () => transit.clear();

    const updateRefreshHeight = (node: HTMLDivElement | null) => node && (refreshHeight.current = node.getBoundingClientRect().height);

    const showRefresh = onPullDownRefresh && exactRefreshing !== undefined;

    React.useEffect(() => {
        if (delayedRefreshing && previousBoundary.current === "top") {
            transitRef.current.to({y: refreshHeight.current});
        } else {
            transitRef.current.clear();
        }
    }, [delayedRefreshing]);

    return (
        <div id={id} className={classNames("g-flat-list", className)} {...bind}>
            <div className="g-flat-list-inner-wrapper" ref={animtedRef}>
                {showRefresh && (
                    <div ref={updateRefreshHeight} className="g-flat-list-refresh">
                        {delayedRefreshing ? <Loader /> : <span>{pullDownMessage ?? "release to refresh"}</span>}
                    </div>
                )}
                <div className="g-flat-list-scrollable" ref={scrollRef} style={{overflow: startDelta ? "hidden" : undefined}} onScroll={onScroll}>
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

/**
 * Prevent flickering refreshing
 * `PS`: This is totally different from prevent flickering loading, the hook make sure refreshing must remain `true` in a certain period of time
 */
function useRefreshing(refreshing: boolean, duration: number): boolean {
    const [guarantee, setGuarantee] = React.useState(refreshing);
    const timerId = React.useRef<number>();
    const lastLoadingTime = React.useRef<number>(Date.now());

    const durationRef = React.useRef(duration);
    durationRef.current = duration;

    React.useEffect(() => {
        if (refreshing) {
            lastLoadingTime.current = Date.now();
            clearTimeout(timerId.current);
            setGuarantee(true);
        } else {
            const remain = durationRef.current - (Date.now() - lastLoadingTime.current);
            if (remain > 0) {
                timerId.current = window.setTimeout(() => setGuarantee(false), remain);
            } else {
                setGuarantee(false);
            }
        }
    }, [refreshing]);

    return guarantee;
}
