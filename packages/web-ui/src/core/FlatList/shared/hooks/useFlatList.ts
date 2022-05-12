import React from "react";
import {Direction} from "../../../../hooks/useSwipe";
import {useTransform} from "../../../../hooks/useTransform";
import type {LoadingType} from "../../type";
import {PULL_DOWN_REFRESH_THRESHOLD} from "../../type";
import {useBounceSwipe} from "./useBounceSwipe";
import {useElementScrollState} from "./useElementScrollState";

interface Options {
    // Use to determine content is scrollable or not
    contentRef: React.RefObject<HTMLElement>;
    // Element Ref which is going to be applied bounce transform and animation
    animatedRef: React.RefObject<HTMLElement>;
    isLoading: boolean;
    onPullDownRefresh?: () => void;
    onPullUpLoading?: () => void;
}

export const useFlatList = (options: Options) => {
    const {contentRef, animatedRef, isLoading, onPullDownRefresh, onPullUpLoading} = options;
    const startOffsetRef = React.useRef(0);

    const [loadingType, setLoadingType] = React.useState<LoadingType>(null);
    const loadingTypeRef = React.useRef<LoadingType>(null);
    loadingTypeRef.current = loadingType;

    const {isScrollable} = useElementScrollState(contentRef);
    const transit = useTransform(animatedRef);
    const transitRef = React.useRef(transit);
    transitRef.current = transit;

    const reset = React.useCallback(() => {
        startOffsetRef.current = 0;
    }, []);

    const handlers = useBounceSwipe({
        axis: "vertical",
        contentRef,
        animatedRef,
        onStart: ({delta: [, y]}) => {
            startOffsetRef.current = y;
        },
        onEnd: ({delta, direction, boundary}) => {
            if (isLoading) {
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
        if (isLoading) {
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
    }, [isLoading]);

    return {handlers, loadingType};
};
