import type {Props as SelectProps, SelectValue, SelectOptionProps} from "../Select";
import {Select} from "../Select";
import React from "react";

export interface Props<ValueType extends SelectValue> extends Omit<SelectProps<ValueType>, "optionFilterProp" | "showSearch" | "optionLabelProp" | "options"> {
    options?: Array<{value: string; label: string}>;
}

export class SearchableSelect<ValueType extends SelectValue> extends React.PureComponent<Props<ValueType>> {
    static displayName = "SearchableSelect";

    static Option = Select.Option as React.ComponentType<SelectOptionProps & {children: string}>;

    render() {
        return <Select optionFilterProp={this.props.options ? "label" : "children"} showSearch {...this.props} />;
    }
}
