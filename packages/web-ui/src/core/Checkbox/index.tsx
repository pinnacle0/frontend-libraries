import React from "react";
import classNames from "classnames";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface CheckboxChangeEvent {
    target: {checked: boolean};
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: Event;
}

export interface CheckboxOptionType {
    label: React.ReactNode;
    value: string | number;
    disabled?: boolean;
    onChange?: (e: CheckboxChangeEvent) => void;
}

export interface CheckboxGroupProps {
    options?: Array<CheckboxOptionType | string>;
    value?: Array<string | number>;
    defaultValue?: Array<string | number>;
    onChange?: (checkedValue: Array<string | number>) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    indeterminate?: boolean;
}

export interface Props extends Omit<CheckboxProps, "value" | "onChange" | "checked">, ControlledFormValue<boolean> {}

const checkboxStyle: React.CSSProperties = {display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, lineHeight: 1.5};
const inputStyle: React.CSSProperties = {width: 16, height: 16, margin: 0, cursor: "inherit"};

const Group = ({options, value = [], defaultValue, onChange, disabled, className, style, children}: CheckboxGroupProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || value);
    const currentValue = value || internalValue;

    const handleChange = (optValue: string | number, checked: boolean) => {
        const next = checked ? [...currentValue, optValue] : currentValue.filter(v => v !== optValue);
        setInternalValue(next);
        onChange?.(next);
    };

    if (children) {
        return (
            <div className={classNames("g-checkbox-group", className)} style={{display: "inline-flex", flexWrap: "wrap", gap: 8, ...style}}>
                {children}
            </div>
        );
    }

    return (
        <div className={classNames("g-checkbox-group", className)} style={{display: "inline-flex", flexWrap: "wrap", gap: 8, ...style}}>
            {options?.map(opt => {
                const optObj = typeof opt === "string" ? {label: opt, value: opt} : opt;
                const checked = currentValue.includes(optObj.value);
                return (
                    <label key={String(optObj.value)} style={{...checkboxStyle, ...(disabled || optObj.disabled ? {cursor: "not-allowed", opacity: 0.65} : {})}}>
                        <input type="checkbox" checked={checked} disabled={disabled || optObj.disabled} onChange={e => handleChange(optObj.value, e.target.checked)} style={inputStyle} />
                        <span>{optObj.label}</span>
                    </label>
                );
            })}
        </div>
    );
};

export const Checkbox = ReactUtil.compound("Checkbox", {Group}, (props: Props) => {
    const {value, onChange, children, disabled, className, style, indeterminate, ...restProps} = props;
    return (
        <label className={classNames("g-checkbox", className)} style={{...checkboxStyle, ...(disabled ? {cursor: "not-allowed", opacity: 0.65} : {}), ...style}}>
            <input
                type="checkbox"
                checked={value}
                onChange={e => onChange(e.target.checked)}
                disabled={disabled}
                ref={el => {
                    if (el) el.indeterminate = !!indeterminate;
                }}
                style={inputStyle}
                {...restProps}
            />
            {children && <span>{children}</span>}
        </label>
    );
});
