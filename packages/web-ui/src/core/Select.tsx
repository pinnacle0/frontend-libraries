import AntSelect from "antd/es/select";
import React from "react";
import type {SelectProps, SelectValue, DefaultOptionType, OptionProps as SelectOptionProps} from "antd/es/select";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "options"> {
    options?: Array<DefaultOptionType>;
}

export class Select<ValueType extends SelectValue> extends React.PureComponent<Props<ValueType>> {
    static displayName = "Select";

    static Option: typeof AntSelect.Option = AntSelect.Option;

    static OptGroup: typeof AntSelect.OptGroup = AntSelect.OptGroup;

    render() {
        return <AntSelect {...this.props} />;
    }
}

export type {SelectValue, SelectOptionProps};
