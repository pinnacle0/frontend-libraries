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
        if (dates && dates[0] && dates[1]) {
            // need manually reset the min/max millisecond
            // otherwise, from/to will use now's millisecond value, which is inaccurate
            const from = dates[0].millisecond(0).toDate();
            const to = dates[1].millisecond(999).toDate();
            typedOnChange([from, to]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className, presets} = this.props;
        return (
            <DatePicker.RangePicker
                className={className}
                value={value[0] && value[1] ? [dayjs(value[0]), dayjs(value[1])] : [null, null]}
                onChange={this.onChange}
                disabledDate={this.isDateDisabled}
                allowClear={allowNull}
                disabled={disabled}
                presets={presets}
                showTime={DateTimeRangePicker.showTime}
            />
        );
    }
}
