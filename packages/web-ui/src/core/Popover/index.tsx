import React from "react";
import RcTooltip from "@rc-component/tooltip";
import "@rc-component/tooltip/assets/bootstrap.css";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props {
    title?: React.ReactNode;
    content?: React.ReactNode | (() => React.ReactNode);
    placement?: "top" | "left" | "right" | "bottom" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "leftTop" | "leftBottom" | "rightTop" | "rightBottom";
    trigger?: "hover" | "focus" | "click" | "contextMenu" | Array<"hover" | "focus" | "click" | "contextMenu">;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    overlayClassName?: string;
    overlayStyle?: React.CSSProperties;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    destroyTooltipOnHide?: boolean;
    arrow?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    childContainerProps?: React.HTMLAttributes<HTMLDivElement>;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    zIndex?: number;
}

export const Popover = ReactUtil.memo("Popover", (props: Props) => {
    const {title, content, children, childContainerProps, placement = "top", trigger = "hover", open, defaultOpen, onOpenChange, overlayClassName, overlayStyle, ...restProps} = props;

    const overlay = (
        <div className="g-popover-content">
            {title && <div style={{fontWeight: 600, marginBottom: 8}}>{title}</div>}
            {typeof content === "function" ? content() : content}
        </div>
    );

    return (
        <RcTooltip
            overlay={overlay}
            placement={placement}
            trigger={Array.isArray(trigger) ? trigger : [trigger]}
            visible={open}
            defaultVisible={defaultOpen}
            onVisibleChange={onOpenChange}
            overlayClassName={overlayClassName}
            overlayStyle={{
                ...overlayStyle,
                padding: 12,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
            }}
            {...(restProps as any)}
        >
            <div {...childContainerProps}>{children}</div>
        </RcTooltip>
    );
});
