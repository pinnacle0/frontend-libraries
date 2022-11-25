import React from "react";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import {AntDatePicker} from "../AntDatePicker";
import type {ControlledFormValue} from "../../internal/type";
import "antd/es/time-picker/style";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    order?: boolean;
}

export class TimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "TimeRangePicker";

    private readonly timeFormatter = "HH:mm:ss";

    onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates && dates[0] && dates[1]) {
            typedOnChange([dates[0].format(this.timeFormatter), dates[1].format(this.timeFormatter)]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, disabled, className, allowNull, order} = this.props;
        return (
            <AntDatePicker.RangePicker
                picker="time"
                mode={undefined}
                className={className}
                value={value[0] && value[1] ? [dayjs(value[0], this.timeFormatter), dayjs(value[1], this.timeFormatter)] : [null, null]}
                onChange={this.onChange}
                disabled={disabled}
                allowClear={allowNull}
                order={order}
            />
        );
    }
}
