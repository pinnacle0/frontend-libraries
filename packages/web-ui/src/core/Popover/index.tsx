import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends PopoverProps {}

export const Popover = ReactUtil.memo("Popover", (props: PopoverProps) => {
    const {children, ...restProps} = props;
    return (
        <AntPopover {...restProps}>
            <React.Fragment>{children}</React.Fragment>
        </AntPopover>
    );
});
