import React from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [Date, Date] : [Date | null, Date | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    presets?: Array<{label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}>;
    preserveInvalidOnBlur?: boolean;
}
export class DateTimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateTimeRangePicker";
    static showTime = {
        defaultValue: [dayjs().startOf("day"), dayjs().endOf("day")],
    };

    isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;

        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;

        const diffToToday = Math.floor(current.diff(dayjs().startOf("day"), "day", true));
        return this.props.disabledRange?.(diffToToday, current.toDate()) || false;
    };

    onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [Date | null, Date | null]) => void;
        if (dates) {
            // need manually reset the min/max millisecond
            // otherwise, from/to will use now's millisecond value, which is inaccurate
            let start = dates[0];
            let end = dates[1];

            if (start && end && start.isAfter(end)) {
                start = dates[1];
                end = dates[0];
            }

            const from = start ? start.millisecond(0).toDate() : null;
            const to = end ? end.millisecond(999).toDate() : null;
            typedOnChange([from, to]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className, presets, preserveInvalidOnBlur = true} = this.props;
        const parsedValue: [Dayjs | null, Dayjs | null] = [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null];
        return (
            <DatePicker.RangePicker
                className={className}
                value={parsedValue}
                onCalendarChange={this.onChange}
                disabledDate={this.isDateDisabled}
                allowClear={allowNull}
                disabled={disabled}
                presets={presets}
                showTime={DateTimeRangePicker.showTime}
                preserveInvalidOnBlur={preserveInvalidOnBlur}
            />
        );
    }
}
