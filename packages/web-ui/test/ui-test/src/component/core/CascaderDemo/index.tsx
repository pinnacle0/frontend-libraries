import React from "react";
import type {CascaderDataNode} from "@pinnacle0/web-ui/core/Cascader";
import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {DemoHelper} from "../../DemoHelper";
import type {DemoHelperGroupConfig} from "../../DemoHelper";

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
}

const cascaderData: Array<CascaderDataNode<TestEnum>> = [
    {
        label: "Item One",
        value: TestEnum.ONE,
        children: [
            {label: "SubItemA", value: TestEnum.ONE_A},
            {label: "SubItemB", value: TestEnum.ONE_B},
            {label: "SubItemC", value: TestEnum.ONE_C},
        ],
    },
    {
        label: "Item Two",
        value: TestEnum.TWO,
        children: [
            {label: "SubItemA", value: TestEnum.TWO_A},
            {label: "SubItemB", value: TestEnum.TWO_B},
            {label: "SubItemC", value: TestEnum.TWO_C},
        ],
    },
    {
        label: "Item Three",
        value: TestEnum.THREE,
    },
];

function SimpleCascader() {
    const [value, setValue] = React.useState(TestEnum.TWO);
    return <Cascader data={cascaderData} value={value} onChange={setValue} style={{width: 500}} />;
}

function InitialNullCascader() {
    const [value, setValue] = React.useState<TestEnum | null>(null);
    return <Cascader data={cascaderData} value={value} onChange={setValue} placeholder="Placeholder test ..." canSelectAnyLevel />;
}

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Simple Cascader",
        components: [<SimpleCascader />],
    },
    {
        title: "Cascader (Initial Null, Can Select Any Level)",
        components: [<InitialNullCascader />],
    },
];

export const CascaderDemo = () => <DemoHelper groups={groups} />;
