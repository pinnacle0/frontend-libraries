import type {PopoverProps} from "antd/es/popover";
import AntPopover from "antd/es/popover";
import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends PopoverProps {
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    isInline?: boolean;
}

const inlineChildStyle: React.CSSProperties = {display: "inline"};

export const Popover = ReactUtil.memo("Popover", (props: Props) => {
    const {children, childContainerProps, isInline, ...restProps} = props;
    return (
        <AntPopover {...restProps}>
            <div {...childContainerProps} style={isInline ? inlineChildStyle : undefined}>
                {children}
            </div>
        </AntPopover>
    );
});
