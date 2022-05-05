import React from "react";
import {useElementScrollState} from "./useElementScrollState";
import type {SwipeHookResult, SwipeState} from "../../../hooks/useSwipe";
import {Direction, useSwipe} from "../../../hooks/useSwipe";
import {useTransform} from "../../../hooks/useTransform";

export type Boundary = "upper" | "lower" | null;

interface BounceSwipeState extends SwipeState {
    // always be null when inner content is not scrollable
    boundary: Boundary;
}

export type BounceSwipeHandler = (state: BounceSwipeState) => void;

type BounceSwipeHookResult = SwipeHookResult;

interface BounceSwipeHandlers {
    onMove?: BounceSwipeHandler;
    onStart?: BounceSwipeHandler;
    onEnd?: BounceSwipeHandler;
    onCancel?: BounceSwipeHandler;
}

interface BounceSwipeOption extends BounceSwipeHandlers {
    axis: "vertical" | "horizontal";
    // Use to determine content is scrollable or not
    contentRef: React.RefObject<HTMLElement>;
    // Element Ref which is going to be applied bounce transform and animation
    animatedRef: React.RefObject<HTMLElement>;
    baseOffset?: number;
}

export const useBounceSwipe = (options: BounceSwipeOption): BounceSwipeHookResult => {
    const {contentRef, animatedRef, axis, baseOffset = 0, onStart, onMove, onEnd, onCancel} = options;
    const [boundary, setBoundary] = React.useState<Boundary>(null);
    const transit = useTransform(animatedRef, {duration: 300, timingFunction: "cubic-bezier(0, 0.61, 0.28, 1.22)", property: "transform"});
    const startOffsetRef = React.useRef(0);

    const isX = React.useMemo(() => axis === "horizontal", [axis]);
    const isY = React.useMemo(() => axis === "vertical", [axis]);
    const {isScrollable, isScrollTop, isScrollBottom, isScrollLeft, isScrollRight} = useElementScrollState(contentRef);

    const threshold = ({direction}: SwipeState): boolean => {
        if (isY) {
            return (direction === Direction.DOWN && isScrollTop()) || (direction === Direction.UP && isScrollBottom());
        } else {
            return (direction === Direction.RIGHT && isScrollLeft()) || (direction === Direction.LEFT && isScrollRight());
        }
    };

    const clearSwipe = () => {
        startOffsetRef.current = 0;
        setBoundary(null);
    };

    React.useEffect(() => {
        if (contentRef.current) {
            if (boundary) {
                contentRef.current.style.overflow = "hidden";
            } else {
                contentRef.current.style.overflow = "auto";
            }
        }
    }, [boundary, contentRef]);

    const getOffset = (delta: [number, number], boundary: Boundary): Readonly<[number, number]> | null => {
        let resultOffset: Readonly<[number, number]> | null = [0, 0];
        const limitedOffset = delta[isX ? 0 : 1] - startOffsetRef.current + baseOffset;
        const computeResultOffset = (value: number) => [isX ? value : 0, isY ? value : 0] as const;
        if (boundary === "upper") {
            resultOffset = limitedOffset < 0 ? null : computeResultOffset(limitedOffset);
        } else if (boundary === "lower") {
            resultOffset = limitedOffset > 0 ? null : computeResultOffset(limitedOffset);
        } else {
            resultOffset = computeResultOffset(limitedOffset);
        }

        return resultOffset;
    };

    const handlers = useSwipe(
        {
            onStart: state => {
                const {
                    delta: [x, y],
                    direction,
                } = state;
                isScrollable(axis) && setBoundary(direction === Direction.DOWN ? "upper" : "lower");
                startOffsetRef.current = isX ? x : y;
                onStart?.({...state, boundary});
            },
            onMove: state => {
                const {delta, cancel} = state;
                const offset = getOffset(delta, boundary);
                if (!offset) {
                    cancel();
                } else {
                    const [x, y] = offset;
                    transit.to({x, y, immediate: true});
                    onMove?.({...state, boundary});
                }
            },
            onEnd: state => {
                onEnd?.({...state, boundary});
                transit.clear();
                clearSwipe();
            },
            onCancel: state => {
                onCancel?.({...state, boundary});
                transit.clear();
                clearSwipe();
            },
        },
        {threshold}
    );

    return handlers;
};
