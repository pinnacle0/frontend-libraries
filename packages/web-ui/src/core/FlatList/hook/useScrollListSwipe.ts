import React from "react";
import {useSwipe, Direction} from "../../../hooks/useSwipe";
import type {SwipeState} from "../../../hooks/useSwipe";
import type {Boundary} from "../type";

const OVER_BOUNDARY_LIMIT = 40;

interface ScrollListSwipeState {
    delta: number;
    boundary: Boundary | null;
    swipeState: SwipeState;
}

export interface ScrollListSwipeOption {
    scrollElementRef: React.RefObject<HTMLElement>;
    onStart: (state: ScrollListSwipeState) => void;
    onMove: (state: ScrollListSwipeState) => void;
    onEnd: (state: ScrollListSwipeState) => void;
    onCancel: (state: ScrollListSwipeState) => void;
}

/**
 * Use useSwipe with Scrollable content
 * 1. prevent scrolling on swiping
 * 1. start counting delta when scroll to top and bottom
 */
export const useScrollListSwipe = ({scrollElementRef, onStart, onMove, onEnd, onCancel}: ScrollListSwipeOption) => {
    const start = React.useRef<Omit<ScrollListSwipeState, "swipeState"> | null>(null);

    const threshold = ({direction}: SwipeState): boolean => {
        const element = scrollElementRef.current;
        if (!element) return false;
        if (direction === Direction.DOWN && isScrollTop(element)) {
            return true;
        } else if (direction === Direction.UP && isScrollBottom(element)) {
            return true;
        }
        return false;
    };

    const clear = () => {
        resumeScrolling();
        start.current = null;
    };

    const calculateState = (state: SwipeState): ScrollListSwipeState | null => {
        const {
            delta: [, y],
        } = state;
        if (!start.current) return null;
        return {delta: y - start.current.delta, boundary: start.current.boundary, swipeState: state};
    };

    const preventScrolling = () => {
        if (scrollElementRef.current) {
            scrollElementRef.current.style.overflowY = "hidden";
        }
    };

    const resumeScrolling = () => {
        if (scrollElementRef.current) {
            scrollElementRef.current.style.overflowY = "";
        }
    };

    const bind = useSwipe(
        {
            onStart: s => {
                const startBounary = getBounaryFromStartDirection(s.direction);
                start.current = {delta: s.delta[1], boundary: startBounary};
                onStart({delta: 0, boundary: startBounary, swipeState: s});
                preventScrolling();
            },
            onMove: s => {
                const state = calculateState(s);
                if (!state) return;
                onMove(state);
                if (state.boundary) {
                    isExceededBounary(state.delta, state.boundary) && s.cancel();
                }
            },
            onEnd: s => {
                const state = calculateState(s);
                if (!state) return;
                onEnd(state);
                clear();
            },
            onCancel: s => {
                const state = calculateState(s);
                if (!state) return;
                onCancel(state);
                clear();
            },
        },
        {threshold, preventDefault: true, stopPropagation: true}
    );

    return bind;
};

export function isExceededBounary(delta: number, boundary: Boundary): boolean {
    switch (boundary) {
        case "top":
            return delta < -OVER_BOUNDARY_LIMIT;
        case "bottom":
            return delta > OVER_BOUNDARY_LIMIT;
    }
}

export function getBounaryFromStartDirection(direction: Direction): Boundary | null {
    switch (direction) {
        case Direction.DOWN:
            return "top";
        case Direction.UP:
            return "bottom";
        default:
            return null;
    }
}

export function isScrollTop(element: HTMLElement): boolean {
    return element.scrollTop === 0;
}

export function isScrollBottom(element: HTMLElement): boolean {
    const {scrollTop, clientHeight, scrollHeight} = element;
    return Math.ceil(scrollTop) + clientHeight >= scrollHeight;
}

export function isScrollLeft(element: HTMLElement) {
    return element.scrollLeft === 0;
}

export function isScrollRight(element: HTMLElement): boolean {
    const {scrollWidth, scrollLeft, clientWidth} = element;
    return Math.ceil(scrollLeft) + clientWidth >= scrollWidth;
}
