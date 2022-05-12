import React from "react";
import {Direction} from "../../../../hooks/useSwipe";
import {useTransform} from "../../../../hooks/useTransform";
import {useBounceSwipe} from "../hooks/useBounceSwipe";
import {useElementScrollState} from "../hooks/useElementScrollState";
import type {FlatListProps, LoadingType} from "../../type";
import {PULL_DOWN_REFRESH_THRESHOLD} from "../../type";
import {Loading} from "./Loading";
import {useLoadingWithDelay} from "../hooks/useLoadingWithDelay";
import "./index.less";

interface Props<T> extends Pick<FlatListProps<T>, "loading" | "bounceEffect" | "onPullUpLoading" | "onPullDownRefresh" | "className" | "style" | "pullDownRefreshMessage"> {
    children: React.ReactNode;
    listWrapperRef: React.RefObject<HTMLDivElement>;
    innerClassName?: string;
    innerStyle?: React.CSSProperties;
    onScroll?: (event: React.UIEvent) => void;
    onLoadingTypeChange?: (type: LoadingType) => void;
}

export const Wrapper = function <T>(props: Props<T>) {
    const {
        children,
        bounceEffect,
        loading = false,
        listWrapperRef,
        onPullDownRefresh,
        onPullUpLoading,
        className,
        innerClassName,
        style,
        innerStyle,
        pullDownRefreshMessage,
        onScroll,
        onLoadingTypeChange,
    } = props;
    const startOffsetRef = React.useRef(0);

    const animatedRef = React.useRef<HTMLDivElement>(null);
    const loadingWithDelay = useLoadingWithDelay(loading, 250);

    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);
    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const onLoadingTypeChangeRef = React.useRef(onLoadingTypeChange);
    onLoadingTypeChangeRef.current = onLoadingTypeChange;

    const {isScrollable} = useElementScrollState(listWrapperRef);
    const transit = useTransform(animatedRef);
    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const reset = React.useCallback(() => {
        startOffsetRef.current = 0;
    }, []);

    const handlers = useBounceSwipe({
        axis: "vertical",
        contentRef: listWrapperRef,
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

    React.useEffect(() => {
        onLoadingTypeChangeRef.current?.(loadingType);
    }, [loadingType]);

    return (
        <div className={`g-flat-list-wrapper${className ? ` ${className}` : ""}`} style={style} {...(bounceEffect ? handlers : {})}>
            <div className={`inner-container${innerClassName ? ` ${innerClassName}` : ""}`} style={innerStyle} ref={animatedRef}>
                <Loading loading={loadingWithDelay && loadingType === "refresh"} message={pullDownRefreshMessage} />
                <div className="list-wrapper" ref={listWrapperRef} onScroll={onScroll}>
                    {children}
                </div>
            </div>
        </div>
    );
};
