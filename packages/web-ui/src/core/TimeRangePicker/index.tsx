import React from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import type {Dayjs} from "dayjs";
import type {ControlledFormValue} from "../../internal/type";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? [string, string] : [string | null, string | null]> {
    allowNull: T;
    disabled?: boolean;
    className?: string;
    order?: boolean;
    preserveInvalidOnBlur?: boolean;
    showSecond?: boolean;
}

const TIME_FORMATTER = "HH:mm:ss";

export const TimeRangePicker = ReactUtil.memo("TimeRangePicker", <T extends boolean>(props: Props<T>) => {
    const {value, disabled, className, allowNull, order, showSecond, preserveInvalidOnBlur = true, onChange} = props;
    const [shouldCheckDateRangeValid, setShouldCheckDateRangeValid] = React.useState(false);

    React.useEffect(() => {
        if (shouldCheckDateRangeValid && value[0] && value[1]) {
            const typedOnChange = onChange as (value: [string | null, string | null]) => void;
            if (value[0] > value[1]) {
                typedOnChange([value[1], value[0]]);
            }
            setShouldCheckDateRangeValid(false);
        }
    }, [onChange, shouldCheckDateRangeValid, value]);

    const onAntChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
        const typedOnChange = onChange as (value: [string | null, string | null]) => void;
        if (dates) {
            const start = dates[0];
            const end = dates[1];
            typedOnChange([start ? start.format(TIME_FORMATTER) : null, end ? end.format(TIME_FORMATTER) : null]);
        } else {
            typedOnChange([null, null]);
        }
    };

    const onOpenChange = (open: boolean) => {
        setShouldCheckDateRangeValid(!open);
    };

    return (
        <DatePicker.RangePicker
            picker="time"
            mode={undefined}
            className={className}
            value={[value[0] ? dayjs(value[0], TIME_FORMATTER) : null, value[1] ? dayjs(value[1], TIME_FORMATTER) : null]}
            onCalendarChange={onAntChange}
            disabled={disabled}
            allowClear={allowNull}
            order={order}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            onOpenChange={onOpenChange}
            showSecond={showSecond}
        />
    );
});
