import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../util/ReactUtil";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps;

export const Tooltip = ReactUtil.memo("Tooltip", (props: TooltipProps) => {
    return (
        <AntTooltip {...props}>
            <Children {...props} />
        </AntTooltip>
    );
});

const Children = React.forwardRef<HTMLDivElement, Omit<TooltipProps, "title">>((props, ref) => {
    return (
        <div ref={ref} {...props}>
            {props.children}
        </div>
    );
});

export type {TooltipPlacement};
