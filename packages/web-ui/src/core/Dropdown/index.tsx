import AntdDropdown from "antd/es/dropdown";
import type {DropdownProps} from "antd/es/dropdown";
import {ReactUtil} from "../../util/ReactUtil";

export type {DropdownButtonProps, DropdownButtonType} from "antd/es/dropdown";
export interface Props extends DropdownProps {}

export const Dropdown = ReactUtil.statics("Dropdown", {
    Button: AntdDropdown.Button,
});
