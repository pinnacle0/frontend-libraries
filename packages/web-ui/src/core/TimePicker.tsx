import AntTimePicker from "antd/lib/time-picker";
import moment, {Moment} from "moment";
import React from "react";
import {ControlledFormValue} from "../internal/type";
import "antd/lib/time-picker/style";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export class TimePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "TimePicker";

    private readonly timeFormatter = "HH:mm:ss";

    onTimeChange = (time: Moment | null) => {
        const {onChange} = this.props;
        const typedOnChange = onChange as (value: string | null) => void;
        if (time) {
            typedOnChange(time.format(this.timeFormatter));
        } else {
            typedOnChange(null);
        }
    };

    render() {
        const {value, allowNull, placeholder, disabled, className} = this.props;
        return (
            <AntTimePicker
                className={className}
                placeholder={placeholder}
                value={value ? moment(value, this.timeFormatter) : null}
                onChange={this.onTimeChange}
                allowClear={allowNull}
                disabled={disabled}
            />
        );
    }
}
