import React from "react";
import AntDatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import type {ControlledFormValue} from "../../internal/type";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    preserveInvalidOnBlur?: boolean;
}

export class DatePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "DatePicker";

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
        return false;
    };

    onChange = (_: Dayjs | null, dateString: string | string[]) => {
        const {onChange, allowNull} = this.props;
        if (dateString || allowNull) {
            const typedOnChange = onChange as (value: string | string[]) => void;
            typedOnChange(dateString);
        }
    };

    render() {
        const {value, allowNull, placeholder, disabled, className, preserveInvalidOnBlur = true} = this.props;
        return (
            <AntDatePicker
                className={className}
                showTime={false}
                disabledDate={this.isDateDisabled}
                placeholder={placeholder}
                value={value ? dayjs(value) : null}
                onChange={this.onChange}
                allowClear={allowNull}
                disabled={disabled}
                preserveInvalidOnBlur={preserveInvalidOnBlur}
            />
        );
    }
}
