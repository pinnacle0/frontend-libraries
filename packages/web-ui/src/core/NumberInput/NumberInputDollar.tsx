import React from "react";
import {i18n} from "../../internal/i18n/core";
import {StringUtil} from "../../internal/StringUtil";
import {NumberInput, Props as NumberInputProps} from "./index";

export interface Props<AllowNull extends boolean> extends Omit<NumberInputProps<AllowNull>, "displayRenderer"> {}

export class NumberInputDollar<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>> {
    static displayName = "NumberInputDollar";

    displayRenderer = (value: number) => StringUtil.interpolate(i18n().dollar, `${value}`);

    render() {
        const {className, ...restProps} = this.props;
        return <NumberInput<AllowNull> className={`money ${className || ""}`} displayRenderer={this.displayRenderer} {...restProps} />;
    }
}
