import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../util/ReactUtil";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps & {childContainerProps?: React.HTMLAttributes<HTMLDivElement>; isInline?: boolean};

const inlineChildStyle: React.CSSProperties = {display: "inline"};

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {children, childContainerProps, isInline, ...restProps} = props;
    return (
        <AntTooltip {...restProps}>
            <div {...childContainerProps} style={isInline ? inlineChildStyle : undefined}>
                {children}
            </div>
        </AntTooltip>
    );
});

export type {TooltipPlacement};
