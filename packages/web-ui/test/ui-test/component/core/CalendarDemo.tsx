import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";
import {DatePicker, Props as DatePickerProps} from "@pinnacle0/web-ui/core/DatePicker";
import {DateRangePicker, Props as DateRangePickerProps} from "@pinnacle0/web-ui/core/DateRangePicker";
import {TimeRangePicker, Props as TimeRangePickerProps} from "@pinnacle0/web-ui/core/TimeRangePicker";
import {TimePicker, Props as TimePickerProps} from "@pinnacle0/web-ui/core/TimePicker";
import {DateTimeRangePicker, Props as DateTimeRangePickerProps} from "@pinnacle0/web-ui/core/DateTimeRangePicker";
import {DateTimePicker, Props as DateTimePickerProps} from "@pinnacle0/web-ui/core/DateTimePicker";

const UncontrolledDatePicker = (props: Omit<DatePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>(null);
    return <DatePicker {...props} value={value} onChange={onChange} />;
};

const UncontrolledDateRangePicker = (props: Omit<DateRangePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>([null, null]);
    return <DateRangePicker {...props} value={value} onChange={onChange} />;
};

const UncontrolledTimePicker = (props: Omit<TimePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>(null);
    return <TimePicker {...props} value={value} onChange={onChange} placeholder="Select Time" />;
};

const UncontrolledTimeRangePicker = (props: Omit<TimeRangePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>([null, null]);
    return <TimeRangePicker {...props} value={value} onChange={onChange} />;
};

const UncontrolledDateTimePicker = (props: Omit<DateTimePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>(null);
    return <DateTimePicker {...props} value={value} onChange={onChange} />;
};

const UncontrolledDateTimeRangePicker = (props: Omit<DateTimeRangePickerProps<any>, "value" | "onChange">) => {
    const [value, onChange] = React.useState<any>([null, null]);
    return <DateTimeRangePicker {...props} value={value} onChange={onChange} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Date Picker",
        components: [<UncontrolledDatePicker allowNull={false} />, <UncontrolledDatePicker allowNull />],
    },
    {
        title: "Date Range Picker",
        components: [<UncontrolledDateRangePicker allowNull={false} />, <UncontrolledDateRangePicker allowNull />],
    },
    {
        title: "Time Picker",
        components: [<UncontrolledTimePicker allowNull={false} />, <UncontrolledTimePicker allowNull />],
    },
    {
        title: "Time Range Picker",
        components: [<UncontrolledTimeRangePicker allowNull={false} />, <UncontrolledTimeRangePicker allowNull />],
    },
    {
        title: "Date Time Picker",
        components: [<UncontrolledDateTimePicker allowNull={false} />, <UncontrolledDateTimePicker allowNull />],
    },
    {
        title: "Date Time Range Picker",
        components: [<UncontrolledDateTimeRangePicker allowNull={false} />, <UncontrolledDateTimeRangePicker allowNull />],
    },
];

export const CalendarDemo = () => <DemoHelper groups={groups.map(_ => ({..._, showPropsHint: false}))} />;
