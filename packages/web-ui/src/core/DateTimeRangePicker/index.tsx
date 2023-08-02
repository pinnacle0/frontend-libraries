import React from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";

// todo:
// deprecate the ranges in props, use presets after antd 5.8.0
// presets: {label: React.ReactNode; value: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])}[];

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [Date, Date] : [Date | null, Date | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    // default ranges for quick select
    ranges?: "presets" | {[range: string]: [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])};
}

export class DateTimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateTimeRangePicker";
    static showTime = {
        defaultValue: [dayjs().startOf("day"), dayjs().endOf("day")],
    };

    // todo: remove this field after antd 5.8.0
    // Arrow function is used to ensure correct calculation of today when website have opened across days
    static presets: {[range: string]: () => [Dayjs, Dayjs]} = {
        当天: () => [dayjs().startOf("day"), dayjs().endOf("day")],
        近7天: () => [dayjs().startOf("day").add(-6, "day"), dayjs().endOf("day")],
        近30天: () => [dayjs().startOf("day").add(-29, "day"), dayjs().endOf("day")],
        近90天: () => [dayjs().startOf("day").add(-89, "day"), dayjs().endOf("day")],
    };

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
        const typedOnChange = this.props.onChange as (value: [Date | null, Date | null]) => void;
        if (dates && dates[0] && dates[1]) {
            typedOnChange([dates[0].toDate(), dates[1].toDate()]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className, ranges} = this.props;
        return (
            <DatePicker.RangePicker
                className={className}
                value={value[0] && value[1] ? [dayjs(value[0]), dayjs(value[1])] : [null, null]}
                onChange={this.onChange}
                disabledDate={this.isDateDisabled}
                allowClear={allowNull}
                disabled={disabled}
                ranges={ranges === "presets" ? DateTimeRangePicker.presets : ranges}
                showTime={DateTimeRangePicker.showTime}
            />
        );
    }
}
