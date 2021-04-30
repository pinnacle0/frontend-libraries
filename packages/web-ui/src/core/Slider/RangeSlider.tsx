import React from "react";
import type {SliderRangeProps} from "antd/lib/slider";
import AntSlider from "antd/lib/slider";
import type {ControlledFormValue} from "../../internal/type";

interface RangeProps extends Omit<SliderRangeProps, "range" | "value" | "onChange">, ControlledFormValue<[number, number]> {
    draggable?: boolean;
}

export class RangeSlider extends React.PureComponent<RangeProps> {
    static displayName = "RangeSlider";

    render() {
        const {draggable, ...rest} = this.props;
        return <AntSlider range={{draggableTrack: draggable}} {...rest} />;
    }
}
