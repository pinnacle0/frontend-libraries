import type {CarouselProps as AntCarouselProps, CarouselRef} from "antd/es/carousel";
import AntCarousel from "antd/es/carousel";
import React from "react";

export type {CarouselRef} from "antd/es/carousel";

export interface Props extends AntCarouselProps {
    innerRef?: React.Ref<CarouselRef>;
}

export class Carousel extends React.PureComponent<Props> {
    static displayName = "Carousel";

    render() {
        const {innerRef, ...props} = this.props;
        return <AntCarousel ref={innerRef} {...props} />;
    }
}
