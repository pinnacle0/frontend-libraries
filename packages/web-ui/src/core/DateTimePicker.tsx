import React from "react";
import DatePicker from "antd/es/date-picker";
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../internal/type";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? Date : Date | null> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    showNow?: boolean;
    disabledRange?: (diffHourToToday: number, date: Date) => boolean;
    preserveInvalidOnBlur?: boolean;
}

export class DateTimePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateTimePicker";

    isDateDisabled = (current: Dayjs): boolean => {
        if (!current) {
            return false;
        }

        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }

        const diffHourToToday = Math.floor(current.diff(dayjs().startOf("hour"), "hour", true));
        return this.props.disabledRange?.(diffHourToToday, current.toDate()) || false;
    };

    onChange = (date: Dayjs | null) => {
        const typedOnChange = this.props.onChange as (value: Date | null) => void;
        if (date) {
            typedOnChange(date.toDate());
        } else {
            typedOnChange(null);
        }
    };

    render() {
        const {value, allowNull, disabled, showNow, className, placeholder, preserveInvalidOnBlur = true} = this.props;
        return (
            <DatePicker
                className={className}
                placeholder={placeholder}
                disabledDate={this.isDateDisabled}
                value={value ? dayjs(value) : null}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                showTime
                showNow={showNow}
                preserveInvalidOnBlur={preserveInvalidOnBlur}
                needConfirm={false}
            />
        );
    }
}
