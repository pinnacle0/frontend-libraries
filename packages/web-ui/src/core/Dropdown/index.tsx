import RcDropdown from "@rc-component/dropdown";
import React from "react";
import {Button} from "../Button";
import type {Props as ButtonProps} from "../Button";
import {DownOutlined} from "../../internal/icons";
import {ReactUtil} from "../../util/ReactUtil";

export type DropdownButtonType = "default" | "primary" | "dashed" | "link" | "text";

export interface DropdownButtonProps extends ButtonProps {
    menu?: {items?: Array<{key: string; label: React.ReactNode; onClick?: () => void; disabled?: boolean}>};
    trigger?: Array<"click" | "hover" | "contextMenu">;
    placement?: string;
}

export interface Props {
    menu?: {items?: Array<{key: string; label: React.ReactNode; onClick?: () => void; disabled?: boolean; danger?: boolean; icon?: React.ReactNode}>};
    trigger?: Array<"click" | "hover" | "contextMenu">;
    placement?: "bottomLeft" | "bottomRight" | "bottomCenter" | "topLeft" | "topRight" | "topCenter";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
    arrow?: boolean;
    destroyPopupOnHide?: boolean;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

const DropdownButton = ({menu, trigger = ["hover"], children, ...buttonProps}: DropdownButtonProps) => {
    const [open, setOpen] = React.useState(false);
    const overlay = (
        <div style={{background: "#fff", borderRadius: 8, boxShadow: "0 6px 16px rgba(0,0,0,0.08)", padding: 4, minWidth: 100}}>
            {menu?.items?.map(item => (
                <div
                    key={item.key}
                    onClick={() => {
                        if (!item.disabled) {
                            item.onClick?.();
                            setOpen(false);
                        }
                    }}
                    style={{padding: "5px 12px", cursor: item.disabled ? "not-allowed" : "pointer", opacity: item.disabled ? 0.5 : 1, borderRadius: 4}}
                >
                    {item.label}
                </div>
            ))}
        </div>
    );

    return (
        <RcDropdown overlay={overlay} trigger={trigger} visible={open} onVisibleChange={setOpen}>
            <Button {...buttonProps}>
                {children} <DownOutlined style={{fontSize: 10, marginLeft: 4}} />
            </Button>
        </RcDropdown>
    );
};

export const Dropdown = ReactUtil.statics("Dropdown", {
    Button: DropdownButton,
});
