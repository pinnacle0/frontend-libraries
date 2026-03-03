import React from "react";
import RcDrawer from "@rc-component/drawer";
import {CloseOutlined} from "../../internal/icons";
import {ReactUtil} from "../../util/ReactUtil";

export interface PushState {
    distance: string | number;
}

export interface Props {
    open?: boolean;
    title?: React.ReactNode;
    closable?: boolean;
    onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    placement?: "left" | "right" | "top" | "bottom";
    width?: number | string;
    height?: number | string;
    size?: number | string;
    mask?: boolean;
    maskClosable?: boolean;
    keyboard?: boolean;
    push?: boolean | PushState;
    destroyOnClose?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    zIndex?: number;
    extra?: React.ReactNode;
    footer?: React.ReactNode;
    getContainer?: string | HTMLElement | (() => HTMLElement) | false;
    afterOpenChange?: (open: boolean) => void;
}

export const Drawer = ReactUtil.memo(
    "Drawer",
    ({open, title, closable = true, onClose, placement = "right", width, height, size, className, children, mask = true, maskClosable = true, keyboard = true, ...restProps}: Props) => {
        const effectiveWidth = width || size || 378;
        const effectiveHeight = height || size || 378;

        return (
            <RcDrawer
                open={open}
                onClose={onClose as any}
                placement={placement}
                width={placement === "left" || placement === "right" ? effectiveWidth : undefined}
                height={placement === "top" || placement === "bottom" ? effectiveHeight : undefined}
                className={className}
                maskClosable={maskClosable}
                keyboard={keyboard}
                mask={mask}
                {...restProps}
            >
                {(title || closable) && (
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid #f0f0f0"}}>
                        <div style={{fontWeight: 600, fontSize: 16}}>{title}</div>
                        {closable && <CloseOutlined onClick={onClose as any} style={{cursor: "pointer", color: "rgba(0,0,0,0.45)", fontSize: 14}} />}
                    </div>
                )}
                <div style={{padding: 24}}>{children}</div>
            </RcDrawer>
        );
    }
);
