import React from "react";
import Slider from "@ant-design/react-slick";
import {ReactUtil} from "../../util/ReactUtil";

export interface CarouselRef {
    goTo: (slideNumber: number, dontAnimate?: boolean) => void;
    next: () => void;
    prev: () => void;
}

export interface Props {
    autoplay?: boolean;
    autoplaySpeed?: number;
    dots?: boolean;
    dotPosition?: "top" | "bottom" | "left" | "right";
    easing?: string;
    fade?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    swipe?: boolean;
    draggable?: boolean;
    adaptiveHeight?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    innerRef?: React.Ref<CarouselRef>;
    afterChange?: (current: number) => void;
    beforeChange?: (from: number, to: number) => void;
}

export const Carousel = ReactUtil.memo("Carousel", ({innerRef, dotPosition = "bottom", ...props}: Props) => {
    const sliderRef = React.useRef<any>(null);

    React.useImperativeHandle(innerRef, () => ({
        goTo: (n: number, dontAnimate?: boolean) => sliderRef.current?.slickGoTo(n, dontAnimate),
        next: () => sliderRef.current?.slickNext(),
        prev: () => sliderRef.current?.slickPrev(),
    }));

    const vertical = dotPosition === "left" || dotPosition === "right";

    return <Slider ref={sliderRef} vertical={vertical} verticalSwiping={vertical} {...props} />;
});
