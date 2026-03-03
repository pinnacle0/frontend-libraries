import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export type TagColor = "magenta" | "red" | "volcano" | "orange" | "gold" | "lime" | "green" | "cyan" | "blue" | "geekblue" | "purple" | "success" | "processing" | "error" | "warning" | "default";

export interface Props {
    color?: TagColor | string;
    closable?: boolean;
    onClose?: (e: React.MouseEvent<HTMLElement>) => void;
    icon?: React.ReactNode;
    bordered?: boolean;
    variant?: "outlined" | "filled" | "borderless";
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

const presetColors: Record<string, {bg: string; border: string; text: string}> = {
    blue: {bg: "#e6f4ff", border: "#91caff", text: "#1677ff"},
    red: {bg: "#fff2f0", border: "#ffccc7", text: "#ff4d4f"},
    green: {bg: "#f6ffed", border: "#b7eb8f", text: "#52c41a"},
    orange: {bg: "#fff7e6", border: "#ffd591", text: "#fa8c16"},
    gold: {bg: "#fffbe6", border: "#ffe58f", text: "#faad14"},
    cyan: {bg: "#e6fffb", border: "#87e8de", text: "#13c2c2"},
    purple: {bg: "#f9f0ff", border: "#d3adf7", text: "#722ed1"},
    magenta: {bg: "#fff0f6", border: "#ffadd2", text: "#eb2f96"},
    volcano: {bg: "#fff2e8", border: "#ffbb96", text: "#fa541c"},
    geekblue: {bg: "#f0f5ff", border: "#adc6ff", text: "#2f54eb"},
    lime: {bg: "#fcffe6", border: "#eaff8f", text: "#a0d911"},
    success: {bg: "#f6ffed", border: "#b7eb8f", text: "#52c41a"},
    processing: {bg: "#e6f4ff", border: "#91caff", text: "#1677ff"},
    error: {bg: "#fff2f0", border: "#ffccc7", text: "#ff4d4f"},
    warning: {bg: "#fffbe6", border: "#ffe58f", text: "#faad14"},
    default: {bg: "#fafafa", border: "#d9d9d9", text: "rgba(0,0,0,0.88)"},
};

export const Tag = ReactUtil.memo("Tag", ({variant = "outlined", color, closable, onClose, icon, bordered = true, className, style, children}: Props) => {
    const [visible, setVisible] = React.useState(true);

    if (!visible) return null;

    const preset = color ? presetColors[color] : presetColors.default;
    const isCustomColor = color && !presetColors[color];

    const tagStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        padding: "0 7px",
        fontSize: 12,
        lineHeight: "20px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        ...(variant === "outlined" || variant === "borderless"
            ? {
                  background: isCustomColor ? "transparent" : (preset?.bg ?? "#fafafa"),
                  border: variant === "borderless" ? "none" : `1px solid ${isCustomColor ? color : (preset?.border ?? "#d9d9d9")}`,
                  color: isCustomColor ? color : (preset?.text ?? "rgba(0,0,0,0.88)"),
              }
            : {
                  background: isCustomColor ? color : (preset?.text ?? "#d9d9d9"),
                  border: "1px solid transparent",
                  color: "#fff",
              }),
        ...(!bordered ? {border: "none"} : {}),
        ...style,
    };

    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        onClose?.(e);
        if (!e.defaultPrevented) setVisible(false);
    };

    return (
        <span className={classNames("g-tag", className)} style={tagStyle}>
            {icon && <span style={{marginRight: 4}}>{icon}</span>}
            {children}
            {closable && (
                <span onClick={handleClose} style={{marginLeft: 4, cursor: "pointer", fontSize: 10}}>
                    ×
                </span>
            )}
        </span>
    );
});
