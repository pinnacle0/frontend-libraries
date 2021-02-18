import AntDatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style";
import moment from "moment";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabledRange?: (diffToToday: number, date: Date) => boolean;
    disabled?: boolean;
    className?: string;
}

export class DateRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateRangePicker";

    private readonly dateFormatter = "YYYY-MM-DD";

    isDateDisabled = (date: moment.Moment): boolean => {
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (date.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }

        // ref: https://momentjs.com/docs/#/displaying/difference/
        const diffToToday = Math.floor(date.diff(moment().startOf("day"), "day", true));

        return this.props.disabledRange?.(diffToToday, date.toDate()) || false;
    };

    onChange = (dates: [moment.Moment | null, moment.Moment | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates && dates[0] && dates[1]) {
            typedOnChange([dates[0].format(this.dateFormatter), dates[1].format(this.dateFormatter)]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, allowNull, disabled, className} = this.props;
        return (
            <AntDatePicker.RangePicker
                disabledDate={this.isDateDisabled}
                className={className}
                showTime={false}
                value={value[0] && value[1] ? [moment(value[0]), moment(value[1])] : [null, null]}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
            />
        );
    }
}
