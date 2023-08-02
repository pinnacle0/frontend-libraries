import React from "react";
import dayjs from "dayjs";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../internal/type";
import DatePicker from "antd/es/date-picker";

// todo:
// deprecate the ranges in props, use presets after antd 5.8.0
// presets: {label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}[];

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
    ranges?: {[range: string]: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])};
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
        if (dates && dates[0] && dates[1]) {
            typedOnChange([dates[0].format(this.dateFormatter), dates[1].format(this.dateFormatter)]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className, ranges} = this.props;
        return (
            <DatePicker.RangePicker
                disabledDate={this.isDateDisabled}
                className={className}
                showTime={false}
                value={value[0] && value[1] ? [dayjs(value[0]), dayjs(value[1])] : [null, null]}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                ranges={ranges}
            />
        );
    }
}
