import React from "react";
import AntCheckbox, {CheckboxChangeEvent, CheckboxOptionType, CheckboxProps} from "antd/lib/checkbox";
import {CheckboxValueType} from "antd/lib/checkbox/Group";
import "antd/lib/checkbox/style";
import {ControlledFormValue} from "../internal/type";

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

export {CheckboxChangeEvent, CheckboxOptionType, CheckboxValueType};
