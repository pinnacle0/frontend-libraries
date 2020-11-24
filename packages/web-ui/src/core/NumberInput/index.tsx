import React from "react";
import {ControlledFormValue} from "../../internal/type";
import {Input} from "../Input";
import {NumberInputDollar} from "./NumberInputDollar";
import {NumberInputPercentage} from "./NumberInputPercentage";
import {canAdd, canMinus, clamp, getDisplayValue, rectifyInputIfValid, truncate} from "./util";
import "./index.less";

// NOTE: Use `this.typeSafeProps` instead of `this.props` inside this component for better type-safety.
// The type argument on `Props<AllowNull extends boolean>` allows better type-inference for consumers of this component.
// However it breaks type-inference inside the component class :(

type DefaultPropsKeys = "scale" | "min" | "max" | "editable" | "stepperMode";

type PropsWithDefault<AllowNull extends boolean = true> = {
    [K in Exclude<keyof Props<AllowNull>, DefaultPropsKeys>]: Props<AllowNull>[K];
} &
    {[K in DefaultPropsKeys]: NonNullable<Props<AllowNull>[K]>};

export interface Props<AllowNull extends boolean> extends ControlledFormValue<AllowNull extends true ? number | null : number> {
    allowNull: AllowNull;
    scale?: number; // Very important for non-integer, due to floating point precision issues
    min?: number;
    max?: number;
    editable?: boolean;
    stepperMode?: "none" | "always" | "hover";
    step?: number;
    displayRenderer?: (value: number) => string; // Only render when blurs
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    inputStyle?: React.CSSProperties;
    suffix?: React.ReactChild;
}

interface State {
    // Used to display editing data, which may be non-numeric.
    // Only blur, or press Enter will trigger onChange.
    editingValue: string;
    isEditing: boolean;
}

export class NumberInput<AllowNull extends boolean> extends React.PureComponent<Props<AllowNull>, State> {
    static displayName = "NumberInput";

    static defaultProps: Pick<Props<any>, DefaultPropsKeys> = {
        scale: 0,
        min: -99_999_999,
        max: 99_999_999,
        editable: true,
        stepperMode: "none",
    };

    static Dollar = NumberInputDollar;

    static Percentage = NumberInputPercentage;

    private inputRef = React.createRef<Input>();

    constructor(props: PropsWithDefault<AllowNull>) {
        super(props);
        this.state = {editingValue: props.value !== null ? props.value.toFixed(props.scale) : "", isEditing: false};
    }

    componentDidUpdate(prevProps: PropsWithDefault<AllowNull>) {
        const {value, max, min, scale, onChange} = this.typeSafeProps;
        const {isEditing} = this.state;
        if (!isEditing && value !== prevProps.value) {
            this.setState({editingValue: value === null ? "" : truncate(value, scale).toString()});
        }
        const shouldCallOnChange = max !== prevProps.max || min !== prevProps.min || scale !== prevProps.scale;
        if (shouldCallOnChange) {
            value === null ? onChange(value) : onChange(clamp({value: truncate(value, scale), min, max}));
        }
    }

    getStep = () => {
        const {step, scale} = this.typeSafeProps;
        if (step !== undefined) {
            return step;
        }
        return truncate(10 ** (-1 * scale), scale);
    };

    triggerParentOnChangeIfValid = (uncheckedValue: string) => {
        this.setState({editingValue: uncheckedValue});

        const typeSafeProps = this.typeSafeProps;
        const {onChange, scale, allowNull} = typeSafeProps;
        const checkedValue = rectifyInputIfValid(uncheckedValue, typeSafeProps);
        // if `null` is not allowed, `checkedValue` will be invalid
        if (checkedValue === "@@INVALID") {
            return;
        }
        const normalizedParentValue = typeSafeProps.value === null ? null : truncate(typeSafeProps.value, scale);
        // Only call onChange if values are different
        if (checkedValue !== normalizedParentValue) {
            onChange(checkedValue);
        }
    };

    stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

    onMinusClick = () => {
        const {value: parentValue} = this.typeSafeProps;
        const step = this.getStep();
        const nextValue: number = parentValue === null ? 0 : parentValue - step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
        this.triggerParentOnChangeIfValid(nextValue.toString()); // The value is checked excessively but it's better than having a unguarded class method
    };

    onAddClick = () => {
        const {value: parentValue} = this.typeSafeProps;
        const step = this.getStep();
        const prevValue: number = parentValue === null ? 0 : parentValue + step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
        this.triggerParentOnChangeIfValid(prevValue.toString()); // The value is checked excessively but it's better than having a unguarded class method
    };

    onInputFocus = () => {
        const {value, scale} = this.typeSafeProps;
        this.setState({isEditing: true, editingValue: value === null ? "" : truncate(value, scale).toString()});
    };

    onInputBlur = () => {
        this.triggerParentOnChangeIfValid(this.state.editingValue);
        this.setState({isEditing: false});
    };

    onInputChange = (newValue: string) => this.triggerParentOnChangeIfValid(newValue);

    onInputPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            this.inputRef.current?.blur();
        }
    };

    render() {
        const {disabled, className, editable, stepperMode, placeholder, inputStyle, suffix} = this.typeSafeProps;
        const {editingValue, isEditing} = this.state;

        // TODO/Lok: refactor canMinus, canAdd so they don't look so ugly
        return (
            <div className={`g-number-input stepper-${stepperMode} ${disabled ? "disabled" : ""} ${className || ""}`} onClick={this.stopPropagation}>
                <button type="button" className="minus" disabled={disabled || !canMinus({...this.typeSafeProps, step: this.getStep()})} onClick={this.onMinusClick}>
                    &#65293;
                </button>
                <Input
                    ref={this.inputRef}
                    style={inputStyle}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={isEditing ? editingValue : getDisplayValue(this.typeSafeProps)}
                    readOnly={!editable}
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                    onChange={this.onInputChange}
                    onKeyPress={this.onInputPress}
                    suffix={suffix}
                    className="count-input"
                />
                <button type="button" className="add" disabled={disabled || !canAdd({...this.typeSafeProps, step: this.getStep()})} onClick={this.onAddClick}>
                    &#xff0b;
                </button>
            </div>
        );
    }

    private get typeSafeProps() {
        // Use a less restrictive type here (allow null) for type inference in various places to work
        return (this.props as unknown) as PropsWithDefault<true>;
    }
}
