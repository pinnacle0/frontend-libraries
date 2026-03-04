import React from "react";
import RcTooltip from "@rc-component/tooltip";
import "@rc-component/tooltip/assets/bootstrap.css";
import {ReactUtil} from "../../util/ReactUtil";

export type TooltipPlacement = "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";

export interface Props {
    title?: React.ReactNode | (() => React.ReactNode);
    placement?: TooltipPlacement;
    trigger?: "hover" | "focus" | "click" | "contextMenu" | Array<"hover" | "focus" | "click" | "contextMenu">;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    overlayClassName?: string;
    overlayStyle?: React.CSSProperties;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    destroyTooltipOnHide?: boolean;
    color?: string;
    arrow?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    zIndex?: number;
}

export const Tooltip = ReactUtil.memo("Tooltip", (props: Props) => {
    const {title, children, childContainerProps, placement = "top", trigger = "hover", open, defaultOpen, onOpenChange, overlayClassName, overlayStyle, ...restProps} = props;

    if (title === undefined || title === null || title === "") {
        return <div {...childContainerProps}>{children}</div>;
    }

    return (
        <RcTooltip
            overlay={typeof title === "function" ? title() : title}
            placement={placement}
            trigger={Array.isArray(trigger) ? trigger : [trigger]}
            visible={open}
            defaultVisible={defaultOpen}
            onVisibleChange={onOpenChange}
            overlayClassName={overlayClassName}
            overlayStyle={overlayStyle}
            {...(restProps as any)}
        >
            <div {...childContainerProps}>{children}</div>
        </RcTooltip>
    );
});
