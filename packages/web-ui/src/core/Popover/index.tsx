import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import "antd/es/popover/style";
import React from "react";
import "./index.less";

interface Props extends PopoverProps {}

export class Popover extends React.PureComponent<Props> {
    static displayName = "Popover";

    render() {
        return <AntPopover {...this.props} />;
    }
}
