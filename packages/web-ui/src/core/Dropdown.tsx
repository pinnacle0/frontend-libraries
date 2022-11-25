import AntdDropdown from "antd/es/dropdown";
import type {DropdownProps} from "antd/es/dropdown";
import "antd/es/dropdown/style";

export type {DropdownButtonProps, DropdownButtonType} from "antd/es/dropdown";
export interface Props extends DropdownProps {}

export class Dropdown {
    static Button: typeof AntdDropdown.Button = AntdDropdown.Button;
}
