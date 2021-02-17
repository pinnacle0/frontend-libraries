import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import type {Props as DatePickerProps} from "@pinnacle0/web-ui/core/DatePicker";
import {DatePicker} from "@pinnacle0/web-ui/core/DatePicker";
import type {Props as DateRangePickerProps} from "@pinnacle0/web-ui/core/DateRangePicker";
import {DateRangePicker} from "@pinnacle0/web-ui/core/DateRangePicker";
import type {Props as TimeRangePickerProps} from "@pinnacle0/web-ui/core/TimeRangePicker";
import {TimeRangePicker} from "@pinnacle0/web-ui/core/TimeRangePicker";
import type {Props as TimePickerProps} from "@pinnacle0/web-ui/core/TimePicker";
import {TimePicker} from "@pinnacle0/web-ui/core/TimePicker";
import type {Props as DateTimeRangePickerProps} from "@pinnacle0/web-ui/core/DateTimeRangePicker";
import {DateTimeRangePicker} from "@pinnacle0/web-ui/core/DateTimeRangePicker";
import type {Props as DateTimePickerProps} from "@pinnacle0/web-ui/core/DateTimePicker";
import {DateTimePicker} from "@pinnacle0/web-ui/core/DateTimePicker";
import {DateCalendar} from "@pinnacle0/web-ui/core/DateCalendar";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";
import {YearMonthSelector} from "../../../../src/core/YearMonthSelector";

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
    return <DateTimeRangePicker disabledRange={_ => _ > 1 && _ < 4} {...props} value={value} onChange={onChange} />;
};

const UncontrolledYearMonthPicker = withUncontrolledInitialValue(YearMonthSelector);

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
    {
        title: "Date Calendar",
        components: [<DateCalendarDemo />],
        showPropsHint: false,
    },
    {
        title: "Year Month Picker",
        components: [<UncontrolledYearMonthPicker allowNull initialValue={null} />],
    },
];

function DateCalendarDemo() {
    const [date, setDate] = React.useState(new Date().toISOString());

    return (
        <div style={{width: 400}}>
            <DateCalendar value={date} onChange={setDate} />
        </div>
    );
}

export const CalendarDemo = () => <DemoHelper groups={groups.map(_ => ({..._, showPropsHint: false}))} />;
