import React from "react";
import {classNames} from "../../util/ClassNames";
import type {FocusType} from "../Input";
import {Input} from "../Input";
import {Button} from "../Button";
import {Space} from "../Space";
import {canAdd, canMinus, clamp, getDisplayValue, rectifyInputIfValid, truncate} from "./util";
import {NumberInputPercentage} from "./NumberInputPercentage";
import type {InputRef} from "antd/es";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export type {InputRef};
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

export const NumberInput = ReactUtil.compound(
    "NumberInput",
    {
        Percentage: NumberInputPercentage,
    },
    <AllowNull extends boolean>(props: Props<AllowNull>) => {
        const {
            value,
            allowNull,
            disabled,
            className,
            editable = true,
            stepperMode,
            placeholder,
            inputStyle,
            suffix,
            prefix,
            allowClear,
            inputRef,
            autoFocus,
            focus,
            scale = 0,
            min = -99_999_999,
            max = 99_999_999,
            step = truncate(10 ** (-1 * scale), scale),
            onChange,
            displayRenderer,
        } = props;
        const [editingValue, setEditingValue] = React.useState(value !== null ? value.toFixed(scale) : "");
        const [isEditing, setIsEditing] = React.useState(false);
        const prevRef = React.useRef({max, min, scale});
        const ref = React.useRef<InputRef>(null);

        React.useEffect(() => {
            !isEditing && setEditingValue(value === null ? "" : truncate(value, scale).toString());
        }, [isEditing, value, scale]);

        React.useEffect(() => {
            const shouldCallOnChange = max < prevRef.current.max || min > prevRef.current.min || scale !== prevRef.current.scale;
            if (shouldCallOnChange) {
                value === null ? onChange(value) : onChange(clamp({value: truncate(value, scale), min, max}));
            }
            prevRef.current = {max, min, scale};
        }, [max, min, scale, value, onChange]);

        const triggerParentOnChangeIfValid = (uncheckedValue: string) => {
            setEditingValue(uncheckedValue);
            const checkedValue = rectifyInputIfValid(uncheckedValue, {min, max, scale, allowNull});
            // if `null` is not allowed, `checkedValue` will be invalid
            if (checkedValue === "@@INVALID") return;

            const normalizedParentValue = value === null ? null : truncate(value, scale);
            // Only call onChange if values are different
            if (checkedValue !== normalizedParentValue) {
                onChange(checkedValue as AllowNull extends true ? number | null : number);
            }
        };

        const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();

        const onMinusClick = () => {
            const nextValue: number = value === null ? 0 : value - step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
            triggerParentOnChangeIfValid(nextValue.toString()); // The value is checked excessively but it's better than having a unguarded class method
        };

        const onAddClick = () => {
            const prevValue: number = value === null ? 0 : value + step; // parentValue is kept in sync with latest valid user input, safe to use the parentValue for stepping
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

        const onInputChange = (newValue: string) => triggerParentOnChangeIfValid(newValue);

        const onInputPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
                (inputRef || ref).current?.blur();
            }
        };

        const containerClassName = classNames("g-number-input", stepperMode, {disabled}, className);
        const content = (
            <React.Fragment>
                {stepperMode && (
                    <Button type={stepperMode === "no-border" ? "text" : "default"} className="minus" disabled={disabled || !canMinus({value, step, min, scale})} onClick={onMinusClick}>
                        &#65293;
                    </Button>
                )}
                <Input
                    inputRef={inputRef || ref}
                    style={inputStyle}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={isEditing ? editingValue : getDisplayValue({value, scale, displayRenderer})}
                    readOnly={!editable}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    onChange={onInputChange}
                    onKeyPress={onInputPress}
                    suffix={suffix}
                    prefix={prefix}
                    inputMode="decimal"
                    allowClear={allowClear}
                    focus={focus}
                    autoFocus={autoFocus}
                    variant={stepperMode === "no-border" ? "borderless" : "outlined"}
                />
                {stepperMode && (
                    <Button type={stepperMode === "no-border" ? "text" : "default"} className="add" disabled={disabled || !canAdd({value, step, max, scale})} onClick={onAddClick}>
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
    }
);
