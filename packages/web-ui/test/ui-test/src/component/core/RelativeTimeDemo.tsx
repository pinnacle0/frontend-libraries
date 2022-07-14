import React, {useEffect} from "react";
import moment from "moment";
import type {Props as RelativeTimeProps} from "@pinnacle0/web-ui/core/RelativeTime";
import {RelativeTime} from "@pinnacle0/web-ui/core/RelativeTime";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const RelativeTimeDisplay = (props: RelativeTimeProps) => {
    return (
        <div>
            <div>{moment(props.date).format()}</div>
            <RelativeTime {...props} />
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
