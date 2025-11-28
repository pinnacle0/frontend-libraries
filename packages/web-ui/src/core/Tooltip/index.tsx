import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends TooltipProps {
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    isInline?: boolean;
}

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {children, childContainerProps = {}, isInline, ...restProps} = props;
    const {style: childContainerStyle = {}, ...restChildContainerProps} = childContainerProps;
    isInline && (childContainerStyle.display = "inline");

    return (
        <AntTooltip {...restProps}>
            <div {...restChildContainerProps} style={childContainerStyle}>
                {children}
            </div>
        </AntTooltip>
    );
});

export type {TooltipPlacement};
