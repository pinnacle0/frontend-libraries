import {AntDatePicker} from "../AntDatePicker";
import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import React from "react";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export class TimePicker<T extends boolean> extends React.PureComponent<Props<T>> {
    static displayName = "TimePicker";

    private readonly timeFormatter = "HH:mm:ss";

    onTimeChange = (time: Dayjs | null) => {
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
            <AntDatePicker
                picker="time"
                mode={undefined}
                className={className}
                placeholder={placeholder}
                value={value ? dayjs(value, this.timeFormatter) : null}
                onChange={this.onTimeChange}
                allowClear={allowNull}
                disabled={disabled}
            />
        );
    }
}
