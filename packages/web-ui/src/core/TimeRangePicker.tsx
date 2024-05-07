import React from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../internal/type";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    order?: boolean;
    preserveInvalidOnBlur?: boolean;
}

export class TimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "TimeRangePicker";

    private readonly timeFormatter = "HH:mm:ss";

    onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates) {
            let start = dates[0];
            let end = dates[1];

            if (start && end && start.isAfter(end)) {
                start = dates[1];
                end = dates[0];
            }
            typedOnChange([start ? start.format(this.timeFormatter) : null, end ? end.format(this.timeFormatter) : null]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, disabled, className, allowNull, order, preserveInvalidOnBlur = true} = this.props;
        return (
            <DatePicker.RangePicker
                picker="time"
                mode={undefined}
                className={className}
                value={[value[0] ? dayjs(value[0], this.timeFormatter) : null, value[1] ? dayjs(value[1], this.timeFormatter) : null]}
                onCalendarChange={this.onChange}
                disabled={disabled}
                allowClear={allowNull}
                order={order}
                preserveInvalidOnBlur={preserveInvalidOnBlur}
            />
        );
    }
}
