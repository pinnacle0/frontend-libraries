import React from "react";
import dayjs from "dayjs";
import {PickerPanel} from "@rc-component/picker";
import dayjsGenerateConfig from "@rc-component/picker/lib/generate/dayjs";
import localeData from "dayjs/plugin/localeData";
import type {ControlledFormValue} from "../../internal/type";
import type {Dayjs} from "dayjs";
import en_US from "@rc-component/picker/lib/locale/en_US";
import {ReactUtil} from "../../util/ReactUtil";

dayjs.extend(localeData);

export interface Props extends ControlledFormValue<string> {}

export const DateCalendar = ReactUtil.memo("DateCalendar", ({value, onChange}: Props) => {
    const isDateDisabled = (current: Dayjs): boolean => {
        if (!current) return false;
        if (current.valueOf() >= new Date(2038, 0).valueOf()) return true;
        return false;
    };

    const onPanelChange = (date: Dayjs) => onChange(dayjs(date).format("YYYY-MM-DD"));

    return <PickerPanel<Dayjs> generateConfig={dayjsGenerateConfig} locale={en_US} disabledDate={isDateDisabled} value={dayjs(value, "YYYY-MM-DD")} onChange={onPanelChange as any} picker="date" />;
});
