import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {MultipleEnumSelect} from "@pinnacle0/web-ui/core/MultipleEnumSelect";
import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "test/ui-test/component/DemoHelper";
import {withUncontrolledInitialValue} from "test/ui-test/util/withUncontrolledInitialValue";

const UncontrolledEnumRadio = withUncontrolledInitialValue(EnumRadio);
const UncontrolledMultipleSelect = withUncontrolledInitialValue(MultipleEnumSelect);
const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);
const UncontrolledCascader = withUncontrolledInitialValue(Cascader);

const PrefixComponent = () => <div style={{width: 20, height: 20, background: "red"}} />;

enum TestEnum {
    ONE,
    TWO,
    THREE,
}

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Enum Radio Demo",
        showPropsHint: true,
        components: [<UncontrolledEnumRadio list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} allowNull={false} />],
    },
    {
        title: "Enum Radio Button Demo",
        showPropsHint: true,
        components: [
            <UncontrolledEnumRadio list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} allowNull={false} useButtonMode />,
            <UncontrolledEnumRadio
                list={[TestEnum.ONE, TestEnum.TWO, TestEnum.THREE]}
                translator={_ => (_ === TestEnum.ONE ? "One" : _ === TestEnum.TWO ? "Two" : "Three")}
                initialValue={TestEnum.ONE}
                allowNull={false}
                useButtonMode
            />,
        ],
    },
    {
        title: "MultipleEnumSelect",
        showPropsHint: true,
        components: [<UncontrolledMultipleSelect list={["apple", "boy", "c++"]} translator={_ => _.toString()} initialValue={["apple"]} style={{width: 200}} />],
    },
    {
        title: "Enum Dropdown Demo",
        showPropsHint: true,
        components: [
            <UncontrolledEnumSelect
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
                style={{
                    width: 200,
                }}
            />,
            <UncontrolledEnumSelect
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
                allowNull={false}
                style={{
                    width: 200,
                }}
            />,
        ],
    },
    {
        title: "Enum Dropdown Demo (with Prefix)",
        showPropsHint: true,
        components: [
            <UncontrolledEnumSelect
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
                allowNull="Pick your food"
                prefix={<PrefixComponent />}
                style={{
                    width: 200,
                }}
            />,
            <UncontrolledEnumSelect
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
                allowNull={false}
                prefix={<div style={{width: 20, height: 20, background: "red"}} />}
                style={{
                    width: 200,
                }}
            />,
        ],
    },
    {
        title: "Cascader",
        showPropsHint: true,
        components: [
            <UncontrolledCascader
                data={[
                    {
                        label: "ItemA",
                        value: "A",
                        children: [
                            {label: "SubItemA", value: "A-a"},
                            {label: "SubItemB", value: "A-b"},
                            {label: "SubItemC", value: "A-c"},
                        ],
                    },
                    {
                        label: "ItemB",
                        value: "B",
                        children: [
                            {label: "SubItemA", value: "B-a"},
                            {label: "SubItemB", value: "B-b"},
                            {label: "SubItemC", value: "B-c"},
                        ],
                    },
                ]}
                initialValue={null}
                canSelectAnyLevel
            />,
        ],
    },
    {
        title: "Cascader (with Prefix)",
        showPropsHint: true,
        components: [
            <UncontrolledCascader
                data={[
                    {
                        label: "ItemA",
                        value: "A",
                        children: [
                            {label: "SubItemA", value: "A-a"},
                            {label: "SubItemB", value: "A-b"},
                            {label: "SubItemC", value: "A-c"},
                        ],
                    },
                    {
                        label: "ItemB",
                        value: "B",
                        children: [
                            {label: "SubItemA", value: "B-a"},
                            {label: "SubItemB", value: "B-b"},
                            {label: "SubItemC", value: "B-c"},
                        ],
                    },
                ]}
                placeholder="Pick your item"
                initialValue={null}
                canSelectAnyLevel
                prefix={<PrefixComponent />}
            />,
        ],
    },
];

export const SelectDemo = () => <DemoHelper groups={groups} />;
