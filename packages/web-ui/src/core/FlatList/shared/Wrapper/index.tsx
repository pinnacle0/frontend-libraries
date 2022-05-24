import React from "react";
import {classNames} from "../../../../util/ClassNames";
import {Direction} from "../../../../hooks/useSwipe";
import {useTransform} from "../../../../hooks/useTransform";
import {useBounceSwipe} from "../hooks/useBounceSwipe";
import {useElementScrollState} from "../hooks/useElementScrollState";
import type {FlatListProps, LoadingType} from "../../type";
import {PULL_DOWN_REFRESH_THRESHOLD} from "../../type";
import {Loading} from "./Loading";
import "./index.less";

interface Props<T>
    extends Pick<FlatListProps<T>, "loading" | "bounceEffect" | "onPullUpLoading" | "onPullDownRefresh" | "className" | "style" | "pullDownRefreshMessage" | "pullDownRefreshingMessage"> {
    children: React.ReactNode;
    listWrapperRef: React.RefObject<HTMLDivElement>;
    loadingType: LoadingType;
    onLoadingTypeChange: (type: LoadingType) => void;
    innerClassName?: string;
    innerStyle?: React.CSSProperties;
    onScroll?: (event: React.UIEvent) => void;
}

export const Wrapper = function <T>(props: Props<T>) {
    const {
        children,
        bounceEffect,
        listWrapperRef,
        loadingType,
        onLoadingTypeChange,
        loading = false,
        onPullDownRefresh,
        onPullUpLoading,
        className,
        innerClassName,
        style,
        innerStyle,
        pullDownRefreshMessage,
        pullDownRefreshingMessage,
        onScroll,
    } = props;
    const startOffsetRef = React.useRef(0);

    const animatedRef = React.useRef<HTMLDivElement>(null);

    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const onLoadingTypeChangeRef = React.useRef(onLoadingTypeChange);
    onLoadingTypeChangeRef.current = onLoadingTypeChange;

    const {isScrollable} = useElementScrollState(listWrapperRef);
    const transform = useTransform(animatedRef);
    const transformRef = React.useRef(transform);
    transformRef.current = transform;

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
            if (loading) {
                if (boundary !== "upper") {
                    transform.to({
                        y: PULL_DOWN_REFRESH_THRESHOLD,
                    });
                }
            } else {
                if (Math.abs(startOffsetRef.current - delta[1]) >= PULL_DOWN_REFRESH_THRESHOLD) {
                    const scrollable = isScrollable("vertical");
                    if (boundary === "upper" || (!scrollable && direction === Direction.DOWN)) {
                        onLoadingTypeChange("refresh");
                        onPullDownRefresh?.();
                    } else {
                        onLoadingTypeChange("loading");
                        onPullUpLoading?.();
                    }
                }
            }
            reset();
        },
        onCancel: reset,
    });

    const handleScroll = React.useCallback(
        (e: React.UIEvent) => {
            transformRef.current.clear();
            onScroll?.(e);
        },
        [onScroll]
    );

    React.useEffect(() => {
        if (loading) {
            if (loadingTypeRef.current === "refresh") {
                transformRef.current.to({
                    y: PULL_DOWN_REFRESH_THRESHOLD,
                    immediate: false,
                });
            }
        } else {
            transformRef.current.clear();
            onLoadingTypeChangeRef.current(null);
        }
    }, [loading]);

    return (
        <div className={classNames(className, "g-flat-list-wrapper")} style={style} {...(bounceEffect ? handlers : {})}>
            <div className={classNames("inner-container", innerClassName)} style={innerStyle} ref={animatedRef}>
                <Loading loading={loading && loadingType === "refresh"} message={pullDownRefreshMessage} loadingMessage={pullDownRefreshingMessage} />
                <div className="list-wrapper" ref={listWrapperRef} onScroll={handleScroll}>
                    {children}
                </div>
            </div>
        </div>
    );
};
