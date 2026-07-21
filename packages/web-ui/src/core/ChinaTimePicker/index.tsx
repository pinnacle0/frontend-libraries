import type {Dayjs} from "dayjs";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import {dayjs, TIMEZONE} from "../../util/DayJS";
import {ChinaAntDatePicker} from "../../internal/ChinaAntDatePicker";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    preserveInvalidOnBlur?: boolean;
    showSecond?: boolean;
}

const TIME_FORMATTER = "HH:mm:ss";

/**
 * Same as `TimePicker`, but its "Now" button and default highlight use Beijing time (UTC+8)
 * regardless of the viewer's machine timezone. The stored value is the same `HH:mm:ss` string.
 */
export const ChinaTimePicker = ReactUtil.memo("ChinaTimePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, placeholder, disabled, className, showSecond, preserveInvalidOnBlur = true, onChange} = props;

    const onTimeChange = (time: Dayjs | null) => {
        const typedOnChange = onChange as (value: string | null) => void;
        if (time) {
            typedOnChange(time.format(TIME_FORMATTER));
        } else {
            typedOnChange(null);
        }
    };

    return (
        <ChinaAntDatePicker
            picker="time"
            mode={undefined}
            className={className}
            placeholder={placeholder}
            value={value ? dayjs.tz(value, TIME_FORMATTER, TIMEZONE) : null}
            onChange={onTimeChange}
            allowClear={allowNull}
            disabled={disabled}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            needConfirm={false}
            showSecond={showSecond}
        />
    );
});
