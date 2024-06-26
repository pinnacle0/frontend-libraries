import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../util/ReactUtil";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps & {childContainerClassName?: string; childContainerStyle?: React.CSSProperties; isInline?: boolean};

const inlineChildStyle: React.CSSProperties = {display: "inline"};

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {children, childContainerClassName, childContainerStyle = {}, isInline, ...restProps} = props;
    const combinedChildContainerStyle = isInline ? {...inlineChildStyle, ...childContainerStyle} : childContainerStyle;
    return (
        <AntTooltip {...restProps}>
            <div className={childContainerClassName} style={combinedChildContainerStyle}>
                {children}
            </div>
        </AntTooltip>
    );
});

export type {TooltipPlacement};
