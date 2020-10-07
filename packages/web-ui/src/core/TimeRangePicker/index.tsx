import React from "react";
import AntTimePicker from "antd/lib/time-picker";
import "antd/lib/time-picker/style";
import moment from "moment";
import {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
}

export class TimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "TimeRangePicker";

    private readonly timeFormatter = "HH:mm:ss";

    onChange = (dates: [moment.Moment | null, moment.Moment | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates && dates[0] && dates[1]) {
            typedOnChange([dates[0].format(this.timeFormatter), dates[1].format(this.timeFormatter)]);
        } else {
            typedOnChange([null, null]);
        }
    };

    render() {
        const {value, disabled, className, allowNull} = this.props;
        return (
            <div className={className}>
                <AntTimePicker.RangePicker
                    className={className}
                    value={value[0] && value[1] ? [moment(value[0], this.timeFormatter), moment(value[1], this.timeFormatter)] : [null, null]}
                    onChange={this.onChange}
                    disabled={disabled}
                    allowClear={allowNull}
                />
            </div>
        );
    }
}
