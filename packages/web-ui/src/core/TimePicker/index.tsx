import type {Dayjs} from "dayjs";
import dayjs from "dayjs";
import React from "react";
import {Picker} from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import type {ControlledFormValue} from "../../internal/type";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props<T extends boolean> extends ControlledFormValue<T extends false ? string : string | null> {
    allowNull: T;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    preserveInvalidOnBlur?: boolean;
    showSecond?: boolean;
}

const TIME_FORMATTER = "HH:mm:ss";

export const TimePicker = ReactUtil.memo("TimePicker", <T extends boolean>(props: Props<T>) => {
    const {value, allowNull, placeholder, disabled, className, showSecond, preserveInvalidOnBlur = true, onChange} = props;

    const onTimeChange = (time: Dayjs | null) => {
        const typedOnChange = onChange as (value: string | null) => void;
        if (time) {
            typedOnChange(time.format(TIME_FORMATTER));
        } else {
            typedOnChange(null);
        }
    };

    return (
        <Picker<Dayjs>
            generateConfig={dayjsGenerateConfig}
            locale={en_US}
            picker="time"
            mode={undefined}
            className={className}
            placeholder={placeholder}
            value={value ? dayjs(value, TIME_FORMATTER) : null}
            onChange={onTimeChange as any}
            allowClear={allowNull}
            disabled={disabled}
            preserveInvalidOnBlur={preserveInvalidOnBlur}
            needConfirm={false}
            showSecond={showSecond}
        />
    );
});
