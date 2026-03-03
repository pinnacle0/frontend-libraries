import React from "react";
import classNames from "classnames";
import type {ControlledFormValue} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import {LoadingOutlined} from "../../internal/icons";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends ControlledFormValue<boolean> {
    trueText?: string;
    falseText?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
    loading?: boolean;
}

const switchContainerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    minWidth: 44,
    height: 22,
    borderRadius: 100,
    cursor: "pointer",
    transition: "background 0.2s",
    padding: "0 7px 0 25px",
    fontSize: 12,
    lineHeight: "22px",
    whiteSpace: "nowrap",
    userSelect: "none",
};

const handleStyle: React.CSSProperties = {
    position: "absolute",
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.2s",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

export const BoolSwitch = ReactUtil.compound(
    "BoolSwitch",
    {
        YesNo: (props: Omit<Props, "trueText" | "falseText">) => {
            const t = i18n();
            return <BoolSwitch trueText={t.yes} falseText={t.no} {...props} />;
        },
        OnOff: (props: Omit<Props, "trueText" | "falseText">) => {
            const t = i18n();
            return <BoolSwitch trueText={t.on} falseText={t.off} {...props} />;
        },
        ActiveOrNot: (props: Omit<Props, "trueText" | "falseText">) => {
            const t = i18n();
            return <BoolSwitch trueText={t.active} falseText={t.inactive} {...props} />;
        },
    },
    ({trueText, falseText, disabled, loading, style, value, onChange}: Props) => {
        const toggle = () => {
            if (!disabled && !loading) onChange(!value);
        };

        const bgColor = value ? "#1677ff" : "rgba(0,0,0,0.25)";
        const label = value ? trueText : falseText;

        return (
            <button
                type="button"
                role="switch"
                aria-checked={value}
                className={classNames("g-switch", {checked: value, disabled: disabled || loading})}
                style={{
                    ...switchContainerStyle,
                    background: bgColor,
                    ...(disabled || loading ? {cursor: "not-allowed", opacity: 0.65} : {}),
                    ...(value ? {padding: "0 25px 0 7px"} : {}),
                    ...style,
                }}
                onClick={toggle}
                disabled={disabled || loading}
            >
                <span style={{...handleStyle, ...(value ? {left: "calc(100% - 20px)"} : {})}}>
                    {loading && <LoadingOutlined style={{fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}} />}
                </span>
                <span style={{color: "#fff"}}>{label}</span>
            </button>
        );
    }
);
