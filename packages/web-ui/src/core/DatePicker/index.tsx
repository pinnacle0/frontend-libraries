import React from "react";
import AntDatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    preserveInvalidOnBlur?: boolean;
}

export const DatePicker = ReactUtil.memo("DatePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, placeholder, disabled, className, preserveInvalidOnBlur = true, onChange} = props;

    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        return current.valueOf() >= new Date(2038, 0).valueOf();
    };

    const onAntChange = (_: Dayjs | null, dateString: string | string[]) => {
        if (dateString || allowNull) {
            const typedOnChange = onChange as (value: string | string[]) => void;
            typedOnChange(dateString);
        }
    };

    return (
        <AntDatePicker
            className={className}
            showTime={false}
            disabledDate={isDateDisabled}
            placeholder={placeholder}
            value={value ? dayjs(value) : null}
            onChange={onAntChange}
            allowClear={allowNull}
            disabled={disabled}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
        />
    );
});
