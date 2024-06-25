import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../util/ReactUtil";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps & {childContainerClassName?: string; childContainerStyle?: React.CSSProperties};

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {children, childContainerClassName, childContainerStyle, ...restProps} = props;

    return (
        <AntTooltip {...restProps}>
            <div className={childContainerClassName} style={childContainerStyle}>
                {children}
            </div>
        </AntTooltip>
    );
});

export type {TooltipPlacement};
