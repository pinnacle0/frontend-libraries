import React from "react";
import AntCheckbox from "antd/es/checkbox";
import type {CheckboxChangeEvent, CheckboxOptionType, CheckboxProps} from "antd/es/checkbox";
import type {ControlledFormValue} from "../internal/type";

export interface Props extends Omit<CheckboxProps, "value" | "onChange" | "checked">, ControlledFormValue<boolean> {}

export class Checkbox extends React.PureComponent<Props> {
    static displayName = "Checkbox";

    static Group = AntCheckbox.Group;

    onChange = (e: CheckboxChangeEvent) => this.props.onChange(e.target.checked);

    render() {
        const {value} = this.props;
        return <AntCheckbox {...this.props} checked={value} onChange={this.onChange} />;
    }
}

export type {CheckboxChangeEvent, CheckboxOptionType};
