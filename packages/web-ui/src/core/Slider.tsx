import React from "react";
import AntSlider, {SliderSingleProps, SliderRangeProps} from "antd/lib/slider";
import {ControlledFormValue} from "../internal/type";
import "antd/lib/slider/style";

type Override<T, O> = Omit<T, keyof O> & O;

interface RangeProps extends Override<Omit<SliderRangeProps, "range">, ControlledFormValue<[number, number]>> {}

class RangeSlider extends React.PureComponent<RangeProps> {
    static displayName = "RangeSlider";

    render() {
        return <AntSlider range {...this.props} />;
    }
}

interface Props extends Override<Omit<SliderSingleProps, "range">, ControlledFormValue<number>> {}

export default class Slider extends React.PureComponent<Props> {
    static displayName = "Slider";

    static Range = RangeSlider;

    render() {
        return <AntSlider range={false} {...this.props} className="slider" />;
    }
}
