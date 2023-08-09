import React from "react";
import {useDidMountEffect} from "../../../hooks/useDidMountEffect";

export const useScrollBarSize = () => {
    const [scrollbarSize, setScrollBarSize] = React.useState(0);

    useDidMountEffect(() => {
        // Creating invisible container
        const element = document.createElement("div");
        element.style.visibility = "hidden";
        element.style.position = "absolute";
        element.style.top = "-9999px";
        element.style.width = "99px";
        element.style.height = "99px";
        element.style.overflow = "scroll"; // forcing scrollbar to appear
        document.body.appendChild(element);
        const {offsetWidth, clientWidth} = element;
        const scrollbarWidth = offsetWidth - clientWidth;
        setScrollBarSize(scrollbarWidth);
        document.body.removeChild(element);
    });

    return scrollbarSize;
};
