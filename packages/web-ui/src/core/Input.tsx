import React from "react";
import AntInput, {InputProps, PasswordProps, SearchProps, TextAreaProps} from "antd/lib/input";
import {ControlledFormValue} from "../internal/type";
import "antd/lib/input/style";

type ExcludedAntInputKeys = "value" | "onChange" | "addonBefore" | "addonAfter";

export interface InputReadonlyProps extends Omit<InputProps, ExcludedAntInputKeys | "readonly" | "disabled" | "allowClear"> {
    value: string;
}

export interface InputSearchProps extends Omit<SearchProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputPasswordProps extends Omit<PasswordProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputNullableProps extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {}

export interface InputNullableTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {}

export interface Props extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export class Input extends React.PureComponent<Props> {
    static displayName = "Input";

    static Group = AntInput.Group;

    static Readonly = (props: InputReadonlyProps) => <AntInput onChange={() => {}} readOnly disabled {...props} />;

    static Search = ({onChange, ...rest}: InputSearchProps) => <AntInput.Search onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static TextArea = ({onChange, ...rest}: InputTextAreaProps) => <AntInput.TextArea onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Password = ({onChange, ...rest}: InputPasswordProps) => <AntInput.Password onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Nullable = ({value, onChange, ...rest}: InputNullableProps) => <Input value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    static NullableTextArea = ({value, onChange, ...rest}: InputNullableTextAreaProps) => <Input.TextArea value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    private static onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onValueChange: (newValue: string) => void) => onValueChange(e.target.value);

    private antInputRef = React.createRef<AntInput>();

    blur = () => this.antInputRef.current?.blur();

    render() {
        const {onChange, ...rest} = this.props;
        return <AntInput {...rest} onChange={e => Input.onChange(e, onChange)} ref={this.antInputRef} />;
    }
}
