import AntDatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style";
import moment from "moment";
import React from "react";
import {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabledRange?: "today-and-before" | "today-and-after";
    disabled?: boolean;
    className?: string;
}

export class DateRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateRangePicker";

    private readonly dateFormatter = "YYYY-MM-DD";

    today = (dayEnd: boolean): number => {
        const date = new Date();
        return dayEnd ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).valueOf() : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0).valueOf();
    };

    isDateDisabled = (current: moment.Moment | null): boolean => {
        const {disabledRange} = this.props;
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current && current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }

        if (current && disabledRange === "today-and-before") {
            return current.valueOf() <= this.today(true);
        } else if (current && disabledRange === "today-and-after") {
            return current.valueOf() >= this.today(false);
        } else {
            return false;
        }
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
