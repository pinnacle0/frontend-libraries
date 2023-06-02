import React from "react";
import AntInput from "antd/es/input";
import type {InputProps, PasswordProps, SearchProps, TextAreaProps, InputRef} from "antd/es/input";
import type {ControlledFormValue} from "../internal/type";
import type {InputFocusOptions} from "antd/es/input/Input";

type ExcludedAntInputKeys = "value" | "onChange" | "addonBefore" | "addonAfter";
export type FocusType = "cursor-at-start" | "cursor-at-last" | "select-all" | "prevent-scroll";

export interface InputReadonlyProps extends Omit<InputProps, ExcludedAntInputKeys | "readonly" | "disabled" | "allowClear"> {
    value: string;
}

export interface InputSearchProps extends Omit<SearchProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputPasswordProps extends Omit<PasswordProps, ExcludedAntInputKeys>, ControlledFormValue<string> {}

export interface InputNullableProps extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {}

export interface InputNullableTextAreaProps extends Omit<TextAreaProps, ExcludedAntInputKeys>, ControlledFormValue<string | null> {}

export interface Props extends Omit<InputProps, ExcludedAntInputKeys>, ControlledFormValue<string> {
    focus?: FocusType;
    inputRef?: React.RefObject<InputRef>;
}

export class Input extends React.PureComponent<Props> {
    static displayName = "Input";

    static Readonly = (props: InputReadonlyProps) => <AntInput onChange={() => {}} readOnly disabled {...props} />;

    static Search = ({onChange, ...rest}: InputSearchProps) => <AntInput.Search onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static TextArea = ({onChange, ...rest}: InputTextAreaProps) => <AntInput.TextArea onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Password = ({onChange, ...rest}: InputPasswordProps) => <AntInput.Password onChange={e => Input.onChange(e, onChange)} {...rest} />;

    static Nullable = ({value, onChange, ...rest}: InputNullableProps) => <Input value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    static NullableTextArea = ({value, onChange, ...rest}: InputNullableTextAreaProps) => <Input.TextArea value={value || ""} onChange={value => onChange(value.trim() ? value : null)} {...rest} />;

    private static onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, onValueChange: (newValue: string) => void) => onValueChange(e.target.value);

    private antInputRef = React.createRef<InputRef>();

    private getRef = () => this.props.inputRef ?? this.antInputRef;

    private createFocusOptions(focus?: FocusType): InputFocusOptions | undefined {
        const type = focus || this.props.focus;
        if (!type) return undefined;
        if (type === "prevent-scroll") {
            return {preventScroll: true};
        } else {
            return {cursor: type === "cursor-at-start" ? "start" : type === "cursor-at-last" ? "end" : "all"};
        }
    }

    private handleClick: React.MouseEventHandler<HTMLInputElement> = event => {
        this.getRef().current?.focus(this.createFocusOptions());
        this.props.onClick?.(event);
    };

    componentDidMount() {
        if (this.props.autoFocus) {
            this.getRef().current?.focus(this.createFocusOptions());
        }
    }

    blur = () => this.getRef().current?.blur();

    focus = (focusType?: FocusType) => (this.props.inputRef || this.antInputRef).current?.focus(this.createFocusOptions(focusType));

    render() {
        const {
            onChange,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in restProps
            autoFocus,
            inputRef,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in restProps
            onClick,
            ...restProps
        } = this.props;
        return <AntInput {...restProps} ref={inputRef || this.antInputRef} onClick={this.handleClick} onChange={e => Input.onChange(e, onChange)} />;
    }
}
