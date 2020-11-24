import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "test/ui-test/component/DemoHelper";
import {OverflowableText} from "@pinnacle0/web-ui/core/OverflowableText";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Overflow",
        components: [
            <OverflowableText text="Not very long" maxWidth={200} />,
            "-",
            <OverflowableText
                maxWidth={200}
                text="Very Very Long, Very Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very Long"
            />,
        ],
        showPropsHint: false,
    },
    {
        title: "Overflow with custom style",
        components: [<OverflowableText text="Should be red" maxWidth={100} style={{color: "red"}} />, "-", <OverflowableText text="Should be red" maxWidth={50} style={{color: "red"}} />],
    },
];

export const OverflowableTextDemo = () => <DemoHelper groups={groups} />;
