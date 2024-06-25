import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends PopoverProps {
    childContainerClassName?: string;
    childContainerStyle?: React.CSSProperties;
}

export const Popover = ReactUtil.memo("Popover", (props: Props) => {
    const {children, childContainerClassName, childContainerStyle, ...restProps} = props;

    return (
        <AntPopover {...restProps}>
            <div className={childContainerClassName} style={childContainerStyle}>
                {children}
            </div>
        </AntPopover>
    );
});
