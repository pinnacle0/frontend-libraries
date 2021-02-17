import React from "react";
import type {ControlledFormValue} from "../internal/type";
import moment from "moment";
import type {Moment} from "moment";
import AntDatePicker from "antd/lib/date-picker";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [number, number] : [number, number] | null> {
    allowNull: T;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export class YearMonthSelector<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DatePicker";

    isDateDisabled = (current: moment.Moment | null): boolean => {
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current && current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }
        return false;
    };

    onChange = (date: Moment | null, dateString: string) => {
        const {onChange, allowNull} = this.props;
        if (dateString || allowNull) {
            const typedOnChange = onChange as (value: [number, number] | null) => void;
            typedOnChange(date && [date.year(), date.month()]);
        }
    };

    render() {
        const {value, allowNull, placeholder, disabled, className} = this.props;

        return (
            <AntDatePicker
                className={className}
                disabledDate={this.isDateDisabled}
                placeholder={placeholder}
                value={value ? moment(value) : null}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                picker="month"
            />
        );
    }
}
