import React from "react";
import {OverflowableText} from "@pinnacle0/web-ui/core/OverflowableText";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import {HTMLContent} from "@pinnacle0/web-ui/core/HTMLContent";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Overflow",
        components: [
            <OverflowableText maxWidth={200}>Not very long</OverflowableText>,
            "-",
            <OverflowableText maxWidth={200}>
                Very Very Long, Very Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very
                LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very LongVery Very
                LongVery Very Long
            </OverflowableText>,
        ],
        showPropsHint: false,
    },
    {
        title: "Overflow with custom style",
        components: [
            <OverflowableText maxWidth={100} style={{color: "red"}}>
                Should be red
            </OverflowableText>,
            "-",
            <OverflowableText maxWidth={50} style={{color: "red"}}>
                Should be red
            </OverflowableText>,
        ],
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
                <OverflowableText maxWidth={100}>{text}</OverflowableText>
                <Input onChange={setText} value={text} />
            </div>
            <div>
                <h3>React Node</h3>
                <OverflowableText maxWidth={100}>
                    <div>{nodeText}</div>
                </OverflowableText>
                <Input onChange={setNodeText} value={nodeText} />
            </div>
            <div>
                <h3>Amount</h3>
                <OverflowableText maxWidth={100}>
                    <Amount scale={0} value={amount} />
                </OverflowableText>
                <NumberInput max={1000000000000000000000000000} allowNull onChange={setAmount} value={amount} />
            </div>
            <div>
                <h3>HTMLContent</h3>
                <OverflowableText maxWidth={100}>
                    <HTMLContent html="<p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p><p>Test</p>" />
                </OverflowableText>
            </div>
        </div>
    );
}

export const OverflowableTextDemo = () => <DemoHelper groups={groups} />;
