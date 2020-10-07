import {Props as RelativeTimeProps, RelativeTime} from "@pinnacle0/web-ui/core/RelativeTime";
import moment from "moment";
import React, {useEffect} from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";

const RelativeTimeDisplay = (props: RelativeTimeProps) => {
    const [initialRepaintTimeout, setInitialRepaintTimeout] = React.useState("-");
    const ref = React.useRef<RelativeTime>(null);
    useEffect(() => {
        const timeout = setTimeout(() => setInitialRepaintTimeout(`${ref.current!["timeoutDuration"] / 1000}`), 10);
        return () => clearTimeout(timeout);
    }, []);
    return (
        <div>
            <div>{moment(props.date).format()}</div>
            <div>Update in {initialRepaintTimeout} seconds</div>
            <RelativeTime {...props} ref={ref} />
        </div>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "RelativeTime",
        components: [
            <RelativeTimeDisplay date={new Date()} />,
            <RelativeTimeDisplay date={new Date("2020-08-13T14:00:00+08:00")} />,
            //
        ],
    },
];

export const RelativeTimeDemo = () => <DemoHelper groups={groups} />;
