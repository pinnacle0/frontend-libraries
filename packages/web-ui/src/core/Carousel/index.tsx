import type {CarouselProps as AntCarouselProps, CarouselRef} from "antd/es/carousel";
import AntCarousel from "antd/es/carousel";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export type {CarouselRef} from "antd/es/carousel";

export interface Props extends AntCarouselProps {
    innerRef?: React.Ref<CarouselRef>;
}

export const Carousel = ReactUtil.memo("Carousel", ({innerRef, ...props}: Props) => {
    return <AntCarousel ref={innerRef} {...props} />;
});
