import AntDatePicker from "antd/lib/date-picker";
import type {Moment} from "moment";
import moment from "moment";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import "antd/lib/date-picker/style";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}

export class DatePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DatePicker";

    isDateDisabled = (current: moment.Moment): boolean => {
        /**
         * This is for compatibility of MySQL.
         * MySQL TIMESTAMP data type is used for values that contain both date and time parts.
         * TIMESTAMP has a range of '1970-01-01 00:00:01' UTC to '2038-01-19 03:14:07' UTC.
         */
        if (current.valueOf() >= new Date(2038, 0).valueOf()) {
            return true;
        }
        return false;
    };

    onChange = (date: Moment | null, dateString: string) => {
        const {onChange, allowNull} = this.props;
        if (dateString || allowNull) {
            const typedOnChange = onChange as (value: string | null) => void;
            typedOnChange(dateString);
        }
    };

    render() {
        const {value, allowNull, placeholder, disabled, className} = this.props;
        return (
            <AntDatePicker
                className={className}
                showTime={false}
                disabledDate={this.isDateDisabled}
                placeholder={placeholder}
                value={value ? moment(value) : null}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
            />
        );
    }
}
