import React from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import arraySupport from "dayjs/plugin/arraySupport";
import {ReactUtil} from "../../util/ReactUtil";

// load plugin when component is imported
dayjs.extend(arraySupport);

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [number, number] : [number, number] | null> {
    allowNull: T;
    disabledRange?: (diffMonthToThisMonth: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
}

export const YearMonthSelector = ReactUtil.memo("YearMonthSelector", <T extends boolean>({value, allowNull, disabled, className, disabledRange, onChange}: Props<T>) => {
    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;

        const diffMonthToThisMonth = Math.floor(current.diff(dayjs().startOf("month"), "month", true));
        return disabledRange?.(diffMonthToThisMonth, current.toDate()) || false;
    };

    const onAntChange = (date: Dayjs | null, dateString: string | null) => {
        if (dateString || allowNull) {
            const typedOnChange = onChange as (value: [number, number] | null) => void;
            typedOnChange(date && [date.year(), date.month() + 1]);
        }
    };

    return (
        <DatePicker
            picker="month"
            className={className}
            disabledDate={isDateDisabled}
            value={value ? dayjs([value[0], value[1] - 1]) : null}
            onChange={onAntChange}
            allowClear={allowNull}
            disabled={disabled}
        />
    );
});
