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
];

export const OverflowableTextDemo = () => <DemoHelper groups={groups} />;
