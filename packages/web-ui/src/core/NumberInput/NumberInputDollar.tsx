import React from "react";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import type {Props as NumberInputProps} from "./index";
import {NumberInput} from "./index";

export interface Props<AllowNull extends boolean> extends Omit<NumberInputProps<AllowNull>, "displayRenderer"> {}

export class NumberInputDollar<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>> {
    static displayName = "NumberInputDollar";

    displayRenderer = (value: number) => TextUtil.interpolate(i18n().dollar, `${value}`);

    render() {
        const {className, ...restProps} = this.props;
        return <NumberInput<AllowNull> className={`money ${className || ""}`} displayRenderer={this.displayRenderer} {...restProps} />;
    }
}
