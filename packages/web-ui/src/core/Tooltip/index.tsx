import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export type {TooltipPlacement};
export interface Props extends TooltipProps {
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {children, childContainerProps, ...restProps} = props;

    return (
        <AntTooltip {...restProps}>
            <div {...childContainerProps}>{children}</div>
        </AntTooltip>
    );
});
