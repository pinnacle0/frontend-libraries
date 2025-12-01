import React from "react";
import AntCheckbox from "antd/es/checkbox";
import type {CheckboxChangeEvent, CheckboxOptionType, CheckboxProps} from "antd/es/checkbox";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export type {CheckboxChangeEvent, CheckboxOptionType};
export interface Props extends Omit<CheckboxProps, "value" | "onChange" | "checked">, ControlledFormValue<boolean> {}

export const Checkbox = ReactUtil.compound("Checkbox", {Group: AntCheckbox.Group}, (props: Props) => {
    return <AntCheckbox {...props} checked={props.value} onChange={e => props.onChange(e.target.checked)} />;
});
