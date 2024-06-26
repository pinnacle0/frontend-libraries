import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends PopoverProps {
    childContainerClassName?: string;
    childContainerStyle?: React.CSSProperties;
    isInline?: boolean;
}

const inlineChildStyle: React.CSSProperties = {display: "inline"};

export const Popover = ReactUtil.memo("Popover", (props: Props) => {
    const {children, childContainerClassName, childContainerStyle = {}, isInline, ...restProps} = props;
    const combinedChildContainerStyle = isInline ? {inlineChildStyle, ...childContainerStyle} : childContainerStyle;
    return (
        <AntPopover {...restProps}>
            <div className={childContainerClassName} style={combinedChildContainerStyle}>
                {children}
            </div>
        </AntPopover>
    );
});
