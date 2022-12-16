import {Direction} from "../../hooks/useSwipe";
import type {Boundary} from "./type";

const OVER_BOUNDARY_LIMIT = 40;

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
