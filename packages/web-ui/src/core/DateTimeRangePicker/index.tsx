import AntDatePicker from "antd/lib/date-picker";
import "antd/lib/date-picker/style";
import moment from "moment";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [Date, Date] : [Date | null, Date | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    // default ranges for quick select
    ranges?: {[range: string]: [moment.Moment, moment.Moment]};
}

export class DateTimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DateTimeRangePicker";

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

    onChange = (dates: [moment.Moment | null, moment.Moment | null] | null) => {
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
            <AntDatePicker.RangePicker
                className={className}
                value={value[0] && value[1] ? [moment(value[0]), moment(value[1])] : [null, null]}
                onChange={this.onChange}
                disabledDate={this.isDateDisabled}
                allowClear={allowNull}
                disabled={disabled}
                ranges={ranges}
                showTime
            />
        );
    }
}
