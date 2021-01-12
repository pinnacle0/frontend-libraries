import type {PopoverProps} from "antd/lib/popover";
import AntPopover from "antd/lib/popover";
import "antd/lib/popover/style";
import React from "react";
import "./index.less";

interface Props extends PopoverProps {}

export class Popover extends React.PureComponent<Props> {
    static displayName = "Popover";

    render() {
        return <AntPopover {...this.props} />;
    }
}
