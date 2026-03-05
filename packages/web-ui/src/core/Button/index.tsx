import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";
import "./index.less";

export type ButtonSize = "large" | "middle" | "small";
export type ButtonShape = "default" | "circle" | "round";
export type ButtonType = "primary" | "default" | "dashed" | "link" | "text";
export type ButtonHTMLType = "submit" | "button" | "reset";

export interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    type?: ButtonType;
    size?: ButtonSize;
    shape?: ButtonShape;
    loading?: boolean;
    disabled?: boolean;
    danger?: boolean;
    ghost?: boolean;
    block?: boolean;
    icon?: React.ReactNode;
    htmlType?: ButtonHTMLType;
}

export const Button = ReactUtil.memo(
    "Button",
    ({className, loading, children, type = "default", size = "middle", shape = "default", danger, ghost, block, icon, htmlType = "button", disabled, ...rest}: Props) => {
        return (
            <button
                className={classNames("g-button", `g-button-${type}`, `g-button-${size}`, className, {
                    loading,
                    "g-button-circle": shape === "circle",
                    "g-button-round": shape === "round",
                    "g-button-danger": danger,
                    "g-button-ghost": ghost,
                    "g-button-block": block,
                })}
                type={htmlType}
                disabled={disabled || loading}
                {...rest}
            >
                {children && <span>{children}</span>}
            </button>
        );
    }
);
