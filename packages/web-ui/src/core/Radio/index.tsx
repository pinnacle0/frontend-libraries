import React from "react";
import classNames from "classnames";
import {ReactUtil} from "../../util/ReactUtil";

export interface RadioChangeEvent {
    target: {value: any; checked: boolean};
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: Event;
}

export type RadioGroupButtonStyle = "outline" | "solid";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: (e: RadioChangeEvent) => void;
    children?: React.ReactNode;
}

interface RadioGroupProps {
    value?: any;
    defaultValue?: any;
    onChange?: (e: RadioChangeEvent) => void;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    optionType?: "default" | "button";
    buttonStyle?: RadioGroupButtonStyle;
}

const RadioGroupContext = React.createContext<{value?: any; onChange?: (e: RadioChangeEvent) => void; disabled?: boolean; optionType?: string; buttonStyle?: RadioGroupButtonStyle} | null>(null);

const radioStyle: React.CSSProperties = {display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, lineHeight: 1.5};
const inputStyle: React.CSSProperties = {width: 16, height: 16, margin: 0, cursor: "inherit"};

const RadioButton = ({value, disabled, children, className, style, onChange, ...restProps}: RadioProps) => {
    const group = React.useContext(RadioGroupContext);
    const checked = group ? group.value === value : false;
    const isDisabled = disabled || group?.disabled;

    const handleChange = () => {
        const event = {target: {value, checked: true}, stopPropagation: () => {}, preventDefault: () => {}, nativeEvent: new Event("change")} as RadioChangeEvent;
        onChange?.(event);
        group?.onChange?.(event);
    };

    const buttonStyle: React.CSSProperties = {
        padding: "4px 15px",
        cursor: isDisabled ? "not-allowed" : "pointer",
        border: "1px solid #d9d9d9",
        borderInlineStart: "none",
        background: checked ? (group?.buttonStyle === "solid" ? "#1677ff" : "#fff") : "#fff",
        color: checked ? (group?.buttonStyle === "solid" ? "#fff" : "#1677ff") : "rgba(0,0,0,0.88)",
        opacity: isDisabled ? 0.65 : 1,
    };

    return (
        <label className={classNames("g-radio-button", className)} style={{...buttonStyle, ...style}}>
            <input type="radio" checked={checked} onChange={handleChange} disabled={isDisabled} style={{display: "none"}} {...restProps} />
            <span>{children}</span>
        </label>
    );
};
RadioButton.displayName = "Radio.Button";

const Group = ({value, onChange, disabled, className, style, children, optionType, buttonStyle}: RadioGroupProps) => {
    return (
        <RadioGroupContext.Provider value={{value, onChange, disabled, optionType, buttonStyle}}>
            <div className={classNames("g-radio-group", className)} style={{display: "inline-flex", flexWrap: "wrap", gap: optionType === "button" ? 0 : 8, ...style}}>
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
};
Group.displayName = "Radio.Group";

const InternalRadio = ({value, disabled, children, className, style, onChange, ...restProps}: RadioProps) => {
    const group = React.useContext(RadioGroupContext);
    const checked = group ? group.value === value : false;
    const isDisabled = disabled || group?.disabled;

    const handleChange = () => {
        const event = {target: {value, checked: true}, stopPropagation: () => {}, preventDefault: () => {}, nativeEvent: new Event("change")} as RadioChangeEvent;
        onChange?.(event);
        group?.onChange?.(event);
    };

    return (
        <label className={classNames("g-radio", className)} style={{...radioStyle, ...(isDisabled ? {cursor: "not-allowed", opacity: 0.65} : {}), ...style}}>
            <input type="radio" checked={checked} onChange={handleChange} disabled={isDisabled} style={inputStyle} {...restProps} />
            {children && <span>{children}</span>}
        </label>
    );
};

export const Radio = ReactUtil.compound("Radio", {Button: RadioButton, Group}, (props: RadioProps) => <InternalRadio {...props} />);
