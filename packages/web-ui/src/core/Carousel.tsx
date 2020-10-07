import AntCarousel, {CarouselProps as AntCarouselProps} from "antd/lib/carousel";
import React from "react";
import "antd/lib/carousel/style";

export interface Props extends AntCarouselProps {}

export class Carousel extends React.PureComponent<Props> {
    static displayName = "Carousel";

    render() {
        return <AntCarousel {...this.props} />;
    }
}
