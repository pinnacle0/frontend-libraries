import type {TooltipPlacement, TooltipProps} from "antd/es/tooltip";
import AntTooltip from "antd/es/tooltip";
import React from "react";
import {ReactUtil} from "../util/ReactUtil";

// Cannot use interface extends here because TooltipProps is a type union
export type Props = TooltipProps;

export const Tooltip = ReactUtil.memo("Tooltip", (props: TooltipProps) => {
    const {children, ...restProps} = props;
    return <AntTooltip {...restProps}>{children}</AntTooltip>;
});

export type {TooltipPlacement};
