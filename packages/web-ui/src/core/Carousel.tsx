import type {CarouselProps as AntCarouselProps, CarouselRef} from "antd/lib/carousel";
import AntCarousel from "antd/lib/carousel";
import React from "react";
import "antd/lib/carousel/style";

export type {CarouselRef} from "antd/lib/carousel";

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
