import React, {Children} from "react";
import type {CascaderDataNode as MultipleCascaderDataNode} from "@pinnacle0/web-ui/core/MultipleCascader";
import type {CascaderDataNode} from "@pinnacle0/web-ui/core/Cascader";
import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {MultipleCascader} from "@pinnacle0/web-ui/core/MultipleCascader";
import {DemoHelper} from "../../DemoHelper";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {withUncontrolledInitialValue} from "../../../util/withUncontrolledInitialValue";

const NullableCascader = withUncontrolledInitialValue(Cascader.Nullable);
const InitialNullableCascader = withUncontrolledInitialValue(Cascader.InitialNullable);
const UncontrolledMultipleCascader = withUncontrolledInitialValue(MultipleCascader);

enum TestEnum {
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    ONE_A = "ONE_A",
    ONE_B = "ONE_B",
    ONE_C = "ONE_C",
    TWO_A = "TWO_A",
    TWO_B = "TWO_B",
    TWO_C = "TWO_C",
    THREE_A = "THREE_A",
    THREE_B = "THREE_B",
    THREE_C = "THREE_C",
}

const cascaderData: Array<CascaderDataNode<TestEnum>> = [
    {
        label: TestEnum.ONE,
        value: TestEnum.ONE,
        children: [
            {
                label: TestEnum.ONE_A,
                value: TestEnum.ONE_A,
                children: [
                    {label: TestEnum.THREE_A, value: TestEnum.THREE_A},
                    {label: TestEnum.THREE_B, value: TestEnum.THREE_B},
                    {label: TestEnum.THREE_C, value: TestEnum.THREE_C},
                ],
            },
            {label: TestEnum.ONE_B, value: TestEnum.ONE_B},
            {label: TestEnum.ONE_C, value: TestEnum.ONE_C},
        ],
    },
    {
        label: TestEnum.TWO,
        value: TestEnum.TWO,
        children: [
            {label: TestEnum.TWO_A, value: TestEnum.TWO_A},
            {label: TestEnum.TWO_B, value: TestEnum.TWO_B},
            {label: TestEnum.TWO_C, value: TestEnum.TWO_C},
        ],
    },
    {
        label: TestEnum.THREE,
        value: TestEnum.THREE,
    },
];

const multipleCascaderData: Array<MultipleCascaderDataNode<TestEnum>> = [
    {
        label: TestEnum.ONE,
        value: [
            {
                label: TestEnum.ONE_A,
                value: [
                    {label: TestEnum.THREE_A, value: TestEnum.THREE_A},
                    {label: TestEnum.THREE_B, value: TestEnum.THREE_B},
                    {label: TestEnum.THREE_C, value: TestEnum.THREE_C},
                ],
            },
            {label: TestEnum.ONE_B, value: TestEnum.ONE_B},
            {label: TestEnum.ONE_C, value: TestEnum.ONE_C},
        ],
    },
    {
        label: TestEnum.TWO,
        value: [
            {label: TestEnum.TWO_A, value: TestEnum.TWO_A},
            {label: TestEnum.TWO_B, value: TestEnum.TWO_B},
            {label: TestEnum.TWO_C, value: TestEnum.TWO_C},
        ],
    },
    {
        label: TestEnum.THREE,
        value: TestEnum.THREE,
    },
];

function SimpleCascader() {
    const [value, setValue] = React.useState(TestEnum.TWO);
    return <Cascader data={cascaderData} value={value} onChange={setValue} style={{width: 500}} />;
}

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Cascader",
        showPropsHint: false,
        components: [<SimpleCascader />],
    },
    {
        title: "Nullable Cascader",
        showPropsHint: false,
        components: [<NullableCascader data={cascaderData} initialValue={null} />],
    },
    {
        title: "InitialNullable Cascader",
        showPropsHint: false,
        components: [<InitialNullableCascader data={cascaderData} initialValue={null} placeholder="Placeholder here" />],
    },
    {
        title: "Multiple Cascader",
        showPropsHint: false,
        components: [<UncontrolledMultipleCascader data={multipleCascaderData} initialValue={[]} placeholder="Placeholder here" />],
    },
];

export const CascaderDemo = () => <DemoHelper groups={groups} />;
