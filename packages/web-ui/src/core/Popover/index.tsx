import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends PopoverProps {
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    isInline?: boolean;
}

export const Popover = ReactUtil.memo("Popover", (props: Props) => {
    const {children, childContainerProps = {}, isInline, ...restProps} = props;
    const {style: childContainerStyle = {}, ...restChildContainerProps} = childContainerProps;
    isInline && (childContainerStyle.display = "inline");

    return (
        <AntPopover {...restProps}>
            <div {...restChildContainerProps} style={childContainerStyle}>
                {children}
            </div>
        </AntPopover>
    );
});
