import React from "react";
import type {DemoHelperGroupConfig} from "@pinnacle0/web-ui-test/ui-test/component/DemoHelper";
import {DemoHelper} from "@pinnacle0/web-ui-test/ui-test/component/DemoHelper";
import {OverflowableText} from "@pinnacle0/web-ui/core/OverflowableText";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import {HTMLContent} from "@pinnacle0/web-ui/core/HTMLContent";

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
    {
        title: "Overflow with changeable text",
        components: [<OverflowableTextWithChangeableText />],
    },
];

function OverflowableTextWithChangeableText() {
    const [text, setText] = React.useState("short text");
    const [nodeText, setNodeText] = React.useState("short text");
    const [amount, setAmount] = React.useState<number | null>(100);

    return (
        <div>
            <div>
                <h3>Pure Text</h3>
                <OverflowableText text={text} maxWidth={100} />
                <Input onChange={setText} value={text} />
            </div>
            <div>
                <h3>React Node</h3>
                <OverflowableText text={<div>{nodeText}</div>} maxWidth={100} />
                <Input onChange={setNodeText} value={nodeText} />
            </div>
            <div>
                <h3>Amount</h3>
                <OverflowableText text={<Amount scale={0} value={amount} />} maxWidth={100} />
                <NumberInput max={1000000000000000000000000000} allowNull onChange={setAmount} value={amount} />
            </div>
            <div>
                <h3>HTMLContent</h3>
                <OverflowableText text={<HTMLContent html="<p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p>" />} maxWidth={100} />
            </div>
        </div>
    );
}

export const OverflowableTextDemo = () => <DemoHelper groups={groups} />;
