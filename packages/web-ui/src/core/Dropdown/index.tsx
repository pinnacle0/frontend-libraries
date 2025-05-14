import AntdDropdown from "antd/es/dropdown";
import type {DropdownProps} from "antd/es/dropdown";

export type {DropdownButtonProps, DropdownButtonType} from "antd/es/dropdown";
export interface Props extends DropdownProps {}

export class Dropdown {
    static Button: typeof AntdDropdown.Button = AntdDropdown.Button;
}
