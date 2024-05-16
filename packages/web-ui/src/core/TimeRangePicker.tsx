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

interface State {
    shouldCheckDateRangeValid: boolean;
}

export class TimeRangePicker<T extends boolean> extends React.PureComponent<Props<T>, State> {
    static displayName = "TimeRangePicker";

    private readonly timeFormatter = "HH:mm:ss";

    constructor(props: Props<T>) {
        super(props);
        this.state = {shouldCheckDateRangeValid: false};
    }

    onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
        if (dates) {
            const start = dates[0];
            const end = dates[1];
            typedOnChange([start ? start.format(this.timeFormatter) : null, end ? end.format(this.timeFormatter) : null]);
        } else {
            typedOnChange([null, null]);
        }
    };

    onOpenChange = (open: boolean) => {
        this.setState({shouldCheckDateRangeValid: !open});
    };

    componentDidUpdate(): void {
        const dates = this.props.value;
        if (this.state.shouldCheckDateRangeValid && dates[0] && dates[1]) {
            const typedOnChange = this.props.onChange as (value: [string | null, string | null]) => void;
            if (dates[0] > dates[1]) {
                typedOnChange([dates[1], dates[0]]);
            }
            this.setState({shouldCheckDateRangeValid: false});
        }
    }

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
                onOpenChange={this.onOpenChange}
            />
        );
    }
}
