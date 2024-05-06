import React from "react";
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../internal/type";
import DatePicker from "antd/es/date-picker";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
    presets?: Array<{label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}>;
    preserveInvalidOnBlur?: boolean;
}

export class DateRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateRangePicker";

    private readonly dateFormatter = "YYYY-MM-DD";

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

        const diffToToday = Math.floor(current.diff(dayjs().startOf("day"), "day", true));
        return this.props.disabledRange?.(diffToToday, current.toDate()) || false;
    };

    onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates) {
            let start = dates[0];
            let end = dates[1];

            if (start && end && start.isAfter(end)) {
                start = dates[1];
                end = dates[0];
            }
            typedOnChange([start ? start.format(this.dateFormatter) : null, end ? end.format(this.dateFormatter) : null]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className, presets, preserveInvalidOnBlur = true} = this.props;
        const parsedValue: [Dayjs | null, Dayjs | null] = [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null];
        return (
            <DatePicker.RangePicker
                disabledDate={this.isDateDisabled}
                className={className}
                showTime={false}
                value={parsedValue}
                onCalendarChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                presets={presets}
                preserveInvalidOnBlur={preserveInvalidOnBlur}
            />
        );
    }
}
