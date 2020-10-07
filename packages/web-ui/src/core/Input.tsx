import AntInput, {InputProps, PasswordProps, SearchProps, TextAreaProps} from "antd/lib/input";
import React, {ChangeEvent} from "react";
import {ControlledFormValue} from "../internal/type";
import "antd/lib/input/style";

export interface InputSearchProps extends Omit<SearchProps, keyof ControlledFormValue<string> | "addonBefore" | "addonAfter">, ControlledFormValue<string> {}

export interface InputTextAreaProps extends Omit<TextAreaProps, keyof ControlledFormValue<string> | "addonBefore" | "addonAfter">, ControlledFormValue<string> {}

export interface InputPasswordProps extends Omit<PasswordProps, keyof ControlledFormValue<string> | "addonBefore" | "addonAfter">, ControlledFormValue<string> {}

export interface InputNullableProps extends Omit<InputProps, keyof ControlledFormValue<string | null> | "addonBefore" | "addonAfter">, ControlledFormValue<string | null> {}

export interface InputNullableTextAreaProps extends Omit<TextAreaProps, keyof ControlledFormValue<string | null> | "addonBefore" | "addonAfter">, ControlledFormValue<string | null> {}

export interface Props extends Omit<InputProps, keyof ControlledFormValue<string> | "addonBefore" | "addonAfter">, ControlledFormValue<string> {}

export class Input extends React.PureComponent<Props> {
    static displayName = "Input";

    static Group = AntInput.Group;

    static Search = ({onChange, ...rest}: InputSearchProps) => <AntInput.Search onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static TextArea = ({onChange, ...rest}: InputTextAreaProps) => <AntInput.TextArea onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Password = ({onChange, ...rest}: InputPasswordProps) => <AntInput.Password onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Nullable = ({value, onChange, ...rest}: InputNullableProps) => <Input value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    static NullableTextArea = ({value, onChange, ...rest}: InputNullableTextAreaProps) => <Input.TextArea value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    private static onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onValueChange: (newValue: string) => void) => onValueChange(e.target.value);

    private antInputRef = React.createRef<AntInput>();

    blur = () => this.antInputRef.current?.blur();

    render() {
        const {onChange, ...rest} = this.props;
        return <AntInput {...rest} onChange={e => Input.onChange(e, onChange)} ref={this.antInputRef} />;
    }
}
