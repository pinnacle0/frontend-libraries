import React from "react";
import AntInput from "antd/es/input";
import type {InputProps, PasswordProps, SearchProps, TextAreaProps, InputRef} from "antd/es/input";
import type {ControlledFormValue} from "../../internal/type";
import type {InputFocusOptions} from "antd/es/input/Input";
import {ReactUtil} from "../../util/ReactUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";

type ExcludedAntInputKeys = "value" | "onChange" | "addonBefore" | "addonAfter";
export type FocusType = "cursor-at-start" | "cursor-at-last" | "select-all" | "prevent-scroll";

export interface InputReadonlyProps extends Omit<InputProps, ExcludedAntInputKeys | "readonly" | "disabled" | "allowClear"> {
    value: string;
}

export interface InputSearchProps extends Omit<SearchProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputPasswordProps extends Omit<PasswordProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputNullableProps extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {
    autoTrim?: boolean;
}

export interface InputNullableTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {}

export interface Props extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string> {
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
        Readonly: (props: InputReadonlyProps) => <AntInput onChange={() => {}} readOnly disabled {...props} />,

        Search: ({onChange, ...rest}: InputSearchProps) => <AntInput.Search onChange={e => handleInputChange(e, onChange)} {...rest} />,

        TextArea: ({onChange, ...rest}: InputTextAreaProps) => <AntInput.TextArea onChange={e => handleInputChange(e, onChange)} {...rest} />,

        Password: ({onChange, ...rest}: InputPasswordProps) => <AntInput.Password onChange={e => handleInputChange(e, onChange)} {...rest} />,

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

        return <AntInput {...restProps} ref={inputRef || antInputRef} onClick={handleClick} onChange={e => handleInputChange(e, onChange, autoTrim)} />;
    })
);
