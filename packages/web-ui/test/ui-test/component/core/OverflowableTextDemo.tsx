import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "test/ui-test/component/DemoHelper";
import {OverflowableText} from "@pinnacle0/web-ui/core/OverflowableText";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Overflow",
        components: [
            <OverflowableText text="Not very long" width={200} />,
            "-",
            <OverflowableText
                width={200}
                text="Very Very Long, Very Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very Long"
            />,
        ],
    },
    {
        title: "Overflow with custom style",
        components: [<OverflowableText text="Should be red" width={{width: 100, color: "red"}} />, <OverflowableText text="Should be red" width={{width: 50, color: "red"}} />],
    },
];

export const OverflowableTextDemo = () => <DemoHelper groups={groups} />;
