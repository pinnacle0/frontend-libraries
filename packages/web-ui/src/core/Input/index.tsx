import React from "react";
import RcInput from "@rc-component/input";
import type {InputProps as RcInputProps, InputRef} from "@rc-component/input";
import type {InputFocusOptions} from "@rc-component/util/lib/Dom/focus";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";

type ExcludedAntInputKeys = "value" | "onChange" | "addonBefore" | "addonAfter";
export type FocusType = "cursor-at-start" | "cursor-at-last" | "select-all" | "prevent-scroll";

export type {InputRef};

export interface InputReadonlyProps extends Omit<RcInputProps, ExcludedAntInputKeys | "readonly" | "disabled" | "allowClear"> {
    value: string;
}

export interface InputSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAntInputKeys | "prefix" | "suffix">, ControlledFormValue<string> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
}

export interface InputTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">, ControlledFormValue<string> {}

export interface InputPasswordProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, ExcludedAntInputKeys | "prefix" | "suffix">, ControlledFormValue<string> {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    allowClear?: boolean;
}

export interface InputNullableProps extends Omit<RcInputProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {
    autoTrim?: boolean;
}

export interface InputNullableTextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange">, ControlledFormValue<string | null> {}

export interface Props extends Omit<RcInputProps, ExcludedAntInputKeys>, ControlledFormValue<string> {
    autoTrim?: boolean;
    focus?: FocusType;
    inputRef?: React.RefObject<InputRef | null>;
}

export interface InputHandler {
    blur: () => void;
    focus: (focusType?: FocusType) => void;
}

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onValueChange: (newValue: string) => void, autoTrim?: boolean) => {
    if (autoTrim) {
        e.target.value = e.target.value.trim();
    }
    onValueChange(e.target.value);
};

export const Input = ReactUtil.compound(
    "Input",
    {
        Readonly: (props: InputReadonlyProps) => <RcInput onChange={() => {}} readOnly disabled {...props} />,

        Search: ({onChange, prefix, suffix, allowClear, ...rest}: InputSearchProps) => <input type="search" onChange={e => handleInputChange(e, onChange)} {...rest} />,

        TextArea: ({onChange, value, ...rest}: InputTextAreaProps) => <textarea value={value} onChange={e => handleInputChange(e, onChange)} {...rest} />,

        Password: ({onChange, prefix, suffix, allowClear, ...rest}: InputPasswordProps) => {
            const [visible, setVisible] = React.useState(false);
            return (
                <div style={{position: "relative", display: "inline-flex", width: "100%"}}>
                    <input type={visible ? "text" : "password"} onChange={e => handleInputChange(e, onChange)} style={{width: "100%", paddingRight: 30}} {...rest} />
                    <span
                        onClick={() => setVisible(!visible)}
                        style={{position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 14, color: "rgba(0,0,0,0.45)"}}
                    >
                        {visible ? "🙈" : "👁"}
                    </span>
                </div>
            );
        },

        Nullable: ({value, onChange, ...rest}: InputNullableProps) => <Input value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />,

        NullableTextArea: ({value, onChange, ...rest}: InputNullableTextAreaProps) => <Input.TextArea value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />,
    },
    React.forwardRef<InputHandler, Props>((props, forwardRef) => {
        const {onChange, autoFocus, autoTrim, inputRef, focus: focusProp, onClick, ...restProps} = props;
        const antInputRef = React.useRef<InputRef>(null);
        const ref = inputRef ?? antInputRef;

        const createFocusOptions = (focusType?: FocusType): InputFocusOptions | undefined => {
            if (!focusType) return undefined;
            if (focusType === "prevent-scroll") {
                return {preventScroll: true};
            } else {
                return {cursor: focusType === "cursor-at-start" ? "start" : focusType === "cursor-at-last" ? "end" : "all"};
            }
        };

        React.useImperativeHandle(forwardRef, () => ({
            blur: () => ref.current?.blur(),
            focus: (focusType?: FocusType) => ref.current?.focus(createFocusOptions(focusType || focusProp)),
        }));

        useDidMountEffect(() => {
            if (autoFocus) ref.current?.focus(createFocusOptions(focusProp));
        });

        const handleClick: React.MouseEventHandler<HTMLInputElement> = event => {
            ref.current?.focus(createFocusOptions(focusProp));
            onClick?.(event);
        };

        return <RcInput {...restProps} ref={inputRef || antInputRef} onClick={handleClick} onChange={e => handleInputChange(e, onChange, autoTrim)} />;
    })
);
