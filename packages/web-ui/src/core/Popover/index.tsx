import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";

export interface Props extends PopoverProps {}

export class Popover extends React.PureComponent<Props> {
    static displayName = "Popover";

    render() {
        const {children, ...restProps} = this.props;
        return (
            <AntPopover {...restProps}>
                <div>{children}</div>
            </AntPopover>
        );
    }
}
