import React from "react";
import AntSlider, {SliderSingleProps, SliderRangeProps} from "antd/lib/slider";
import {ControlledFormValue} from "../../internal/type";
import "antd/lib/slider/style";
import {Button} from "../Button";
import "./index.less";

type Override<T, O> = Omit<T, keyof O> & O;

interface RangeProps extends Override<Omit<SliderRangeProps, "range">, ControlledFormValue<[number, number]>> {}

class RangeSlider extends React.PureComponent<RangeProps> {
    static displayName = "RangeSlider";

    render() {
        return <AntSlider range {...this.props} />;
    }
}

interface Props extends Override<Omit<SliderSingleProps, "range">, ControlledFormValue<number>> {
    showButton?: boolean;
}

export default class Slider extends React.PureComponent<Props> {
    static displayName = "Slider";

    static Range = RangeSlider;

    render() {
        const {showButton, onChange, value, step = 1, ...rest} = this.props;
        return (
            <span className="g-slider">
                {showButton && (
                    <Button onClick={() => onChange(value - step!)}>
                        <span className="squeeze">{"<"}</span>
                    </Button>
                )}
                <AntSlider range={false} {...rest} className="slider" value={value} onChange={onChange} />
                {showButton && (
                    <Button onClick={() => onChange(value + step!)}>
                        <span className="squeeze"> {">"}</span>
                    </Button>
                )}
            </span>
        );
    }
}
