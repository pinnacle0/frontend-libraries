import AntdDropdown from "antd/lib/dropdown";
import type {DropdownProps} from "antd/lib/dropdown";
import "antd/lib/dropdown/style";

export type {DropdownButtonProps, DropdownButtonType} from "antd/lib/dropdown";
export interface Props extends DropdownProps {}

export class Dropdown {
    static Button: typeof AntdDropdown.Button = AntdDropdown.Button;
}
