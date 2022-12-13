import "../../internal/polyfill/IntersectionObserver";
import React from "react";
import {useSwipe} from "../../hooks";

export const FlatList = () => {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);

    const isDragable = () => {
        const el = scrollRef.current;
        if (el) {
            return isScrollTop(el) || isScrollBottom(el) ? true : false;
        }
        return false;
    };

    const bind = useSwipe(
        {
            onStart() {
                console.log("start");
            },
        },
        {ref: scrollRef, preventDefault: true, threshold: () => isDragable()}
    );

    return (
        <div className="g-flat-list" {...bind}>
            <div>content</div>
        </div>
    );
};

function isScrollTop(element: HTMLElement): boolean {
    return element.scrollTop === 0;
}

function isScrollBottom(element: HTMLElement): boolean {
    const {scrollTop, clientHeight, scrollHeight} = element;
    return Math.ceil(scrollTop) + clientHeight >= scrollHeight;
}
