import React from "react";
import {classNames} from "../../util/ClassNames";
import type {FocusType} from "../Input";
import {Input} from "../Input";
import {Button} from "../Button";
import {Space} from "../Space";
import {canAdd, canMinus, clamp, getDisplayValue, rectifyInputIfValid, truncate} from "./util";
import {NumberInputPercentage} from "./NumberInputPercentage";
import type {InputRef as AntInputRef} from "antd/es";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export type InputRef = AntInputRef;

export interface Props<AllowNull extends boolean> extends ControlledFormValue<AllowNull extends true ? number | null : number> {
    /** Whether `null` is allowed in `value` */
    allowNull: AllowNull;
    /** Clear button to clear value */
    allowClear?: boolean;
    /** Set number of decimal points for `value`. Important due to floating point precision issues  */
    scale?: number; // Very important for non-integer, due to floating point precision issues
    /** Minimum value allowed as input. Out of range values are discarded onBlur, and does not trigger onChange. */
    min?: number;
    /** Maximum value allowed as input. Out of range values are discarded onBlur, and does not trigger onChange. */
    max?: number;
    /** Whether the input field should be editable */
    editable?: boolean;
    /** Set the increment/decrement stepper display options */
    stepperMode?: "outlined" | "no-border";
    /** Set the interval to increment/decrement with stepper */
    step?: number;
    /** Callback function to render value onBlur */
    displayRenderer?: (value: number) => string;
    /** Whether the input field is disabled */
    disabled?: boolean;
    /** Placeholder text to display when input field is empty */
    placeholder?: string;
    /** Additional className for input field */
    className?: string;
    /** Additional style for input field */
    inputStyle?: React.CSSProperties;
    /** Additional component to render after input field */
    suffix?: React.ReactElement | string | number | null;
    /** Additional component to render before input field */
    prefix?: React.ReactElement | string | number | null;
    /** Optional Input Ref */
    inputRef?: React.RefObject<InputRef>;
    /** Auto focus when input first shown */
    autoFocus?: boolean;
    /** Set cursor and input behavior when focus  */
    focus?: FocusType;
}

export const NumberInput = ReactUtil.memo("NumberInput", <AllowNull extends boolean>(props: Props<AllowNull>) => {
    const typeSafeProps = {...props, editable: props.editable === undefined ? true : props.editable, scale: props.scale ?? 0, min: props.min ?? -99_999_999, max: props.max ?? 99_999_999};
    const {editable, scale, min, max, disabled, className, stepperMode, placeholder, inputStyle, suffix, prefix, allowClear, inputRef, autoFocus, focus, onChange, value, step} = typeSafeProps;
    const [editingValue, setEditingValue] = React.useState(props.value !== null ? props.value.toFixed(props.scale) : "");
    const [isEditing, setIsEditing] = React.useState(false);
    const thisInputRef = React.useRef<InputRef>(null);

    React.useEffect(() => {
        if (!isEditing) {
            setEditingValue(value === null ? "" : truncate(value, scale).toString());
        }
    }, [isEditing, scale, value]);

    React.useEffect(() => {
        value === null ? onChange(value) : onChange(clamp({value: truncate(value, scale), min, max}));
    }, [value, onChange, scale, min, max]);

    const getStep = () => {
        if (step !== undefined) {
            return step;
        }
        return truncate(10 ** (-1 * scale), scale);
    };

    const triggerParentOnChangeIfValid = (uncheckedValue: string) => {
        setEditingValue(uncheckedValue);
        const checkedValue = rectifyInputIfValid(uncheckedValue, typeSafeProps);
        // if `null` is not allowed, `checkedValue` will be invalid
        if (checkedValue === "@@INVALID") {
            return;
        }
        const normalizedParentValue = typeSafeProps.value === null ? null : truncate(typeSafeProps.value, scale);
        // Only call onChange if values are different
        if (checkedValue !== normalizedParentValue) {
            onChange(checkedValue as number);
        }
    };

    const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

    const onMinusClick = () => {
        const {value: parentValue} = typeSafeProps;
        const step = getStep();
        const nextValue: number = parentValue === null ? 0 : parentValue - step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
        triggerParentOnChangeIfValid(nextValue.toString()); // The value is checked excessively but it's better than having a unguarded class method
    };

    const onAddClick = () => {
        const {value: parentValue} = typeSafeProps;
        const step = getStep();
        const prevValue: number = parentValue === null ? 0 : parentValue + step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
        triggerParentOnChangeIfValid(prevValue.toString()); // The value is checked excessively but it's better than having a unguarded class method
    };

    const onInputFocus = () => {
        setIsEditing(true);
        setEditingValue(value === null ? "" : truncate(value, scale).toString());
    };

    const onInputBlur = () => {
        triggerParentOnChangeIfValid(editingValue);
        setIsEditing(false);
    };

    const onInputChange = (newValue: string) => {
        triggerParentOnChangeIfValid(newValue);
    };

    const onInputPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            (inputRef || thisInputRef).current?.blur();
        }
    };

    const containerClassName = classNames("g-number-input", stepperMode, {disabled}, className);
    const content = (
        <React.Fragment>
            {stepperMode && (
                <Button type={stepperMode === "no-border" ? "text" : "default"} className="minus" disabled={disabled || !canMinus({...typeSafeProps, step: getStep()})} onClick={onMinusClick}>
                    &#65293;
                </Button>
            )}
            <Input
                inputRef={inputRef || thisInputRef}
                style={inputStyle}
                placeholder={placeholder}
                disabled={disabled}
                value={isEditing ? editingValue : getDisplayValue(typeSafeProps)}
                readOnly={!editable}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                onChange={onInputChange}
                onKeyDown={onInputPress}
                suffix={suffix}
                prefix={prefix}
                inputMode="decimal"
                allowClear={allowClear}
                focus={focus}
                autoFocus={autoFocus}
                variant={stepperMode === "no-border" ? "borderless" : "outlined"}
            />
            {stepperMode && (
                <Button type={stepperMode === "no-border" ? "text" : "default"} className="add" disabled={disabled || !canAdd({...typeSafeProps, step: getStep()})} onClick={onAddClick}>
                    &#xff0b;
                </Button>
            )}
        </React.Fragment>
    );

    return stepperMode === "outlined" ? (
        <Space.Compact className={containerClassName} onClick={stopPropagation}>
            {content}
        </Space.Compact>
    ) : (
        <Space className={containerClassName} onClick={stopPropagation} size={0}>
            {content}
        </Space>
    );
});

Object.assign(NumberInput, {
    Percentage: NumberInputPercentage,
});
