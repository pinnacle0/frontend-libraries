import AntSelect, {SelectProps, SelectValue} from "antd/lib/select";
import {OptionProps as SelectOptionProps} from "rc-select/lib/Option";
import React from "react";
import "antd/lib/select/style";

export interface Props<ValueType extends SelectValue> extends SelectProps<ValueType> {}

export class Select<ValueType extends SelectValue> extends React.PureComponent<Props<ValueType>> {
    static displayName = "Select";

    static Option = AntSelect.Option;

    static OptGroup = AntSelect.OptGroup;

    render() {
        return <AntSelect {...this.props} />;
    }
}

export type {SelectValue, SelectOptionProps};
