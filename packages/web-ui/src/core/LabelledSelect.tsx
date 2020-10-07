import {Select, Props as SelectProps, SelectValue, SelectOptionProps} from "./Select";
import React from "react";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "optionLabelProp"> {}

export class LabelledSelect<ValueType extends SelectValue> extends React.PureComponent<Props<ValueType>> {
    static displayName = "LabelledSelect";

    static Option = Select.Option as React.ComponentType<SelectOptionProps & {label: string}>;

    render() {
        return <Select optionLabelProp="label" {...this.props} />;
    }
}
