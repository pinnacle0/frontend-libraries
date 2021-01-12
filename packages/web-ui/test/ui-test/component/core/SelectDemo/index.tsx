import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {MultipleEnumSelect} from "@pinnacle0/web-ui/core/MultipleEnumSelect";
import React from "react";
import type {DemoHelperGroupConfig} from "@pinnacle0/web-ui-test/ui-test/component/DemoHelper";
import {DemoHelper} from "@pinnacle0/web-ui-test/ui-test/component/DemoHelper";
import {withUncontrolledInitialValue} from "@pinnacle0/web-ui-test/ui-test/util/withUncontrolledInitialValue";
import {BoolRadio} from "@pinnacle0/web-ui/core/BoolRadio";

const UncontrolledEnumRadio = withUncontrolledInitialValue(EnumRadio);
const UncontrolledBoolRadio = withUncontrolledInitialValue(BoolRadio);
const UncontrolledEnumRadioNullable = withUncontrolledInitialValue(EnumRadio.Nullable);
const UncontrolledEnumRadioInitialNullable = withUncontrolledInitialValue(EnumRadio.InitialNullable);
const UncontrolledMultipleSelect = withUncontrolledInitialValue(MultipleEnumSelect);
const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);
const UncontrolledEnumSelectNullable = withUncontrolledInitialValue(EnumSelect.Nullable);
const UncontrolledEnumSelectInitialNullable = withUncontrolledInitialValue(EnumSelect.InitialNullable);
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
        components: [<UncontrolledEnumRadio list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} />],
    },
    {
        title: "Nullable Enum Radio Demo",
        showPropsHint: true,
        components: [<UncontrolledEnumRadioNullable list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} />],
    },
    {
        title: "Initial Nullable Enum Radio Demo",
        showPropsHint: true,
        components: [<UncontrolledEnumRadioInitialNullable list={[1, 2, 3]} translator={_ => _ + ""} initialValue={null} />],
    },
    {
        title: "Enum Radio Button Demo",
        showPropsHint: true,
        components: [
            <UncontrolledEnumRadio list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} useButtonMode />,
            <UncontrolledEnumRadio
                list={[TestEnum.ONE, TestEnum.TWO, TestEnum.THREE]}
                translator={_ => (_ === TestEnum.ONE ? "One" : _ === TestEnum.TWO ? "Two" : "Three")}
                initialValue={TestEnum.ONE}
                useButtonMode
            />,
        ],
    },
    {
        title: "Boolean Radio Nullable",
        showPropsHint: true,
        components: [<UncontrolledBoolRadio nullable initialValue={null} />],
    },
    {
        title: "Boolean Radio Initial Nullable",
        showPropsHint: true,
        components: [<UncontrolledBoolRadio initialValue />],
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
                initialValue="apple"
                translator={_ => String(_).toUpperCase()}
                style={{
                    width: 200,
                }}
            />,
            <UncontrolledEnumSelect
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue="banana"
                translator={_ => String(_).toUpperCase()}
                style={{
                    width: 200,
                }}
            />,
        ],
    },
    {
        title: "Nullable Enum Dropdown Demo (with Prefix)",
        showPropsHint: true,
        components: [
            <UncontrolledEnumSelectNullable
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
                nullText="Pick your food"
                style={{
                    width: 200,
                }}
            />,
            <UncontrolledEnumSelectNullable
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue="apple"
                translator={_ => String(_).toUpperCase()}
                style={{
                    width: 200,
                }}
            />,
        ],
    },
    {
        title: "Initial Nullable Enum Dropdown Demo (with Prefix)",
        showPropsHint: true,
        components: [
            <UncontrolledEnumSelectInitialNullable
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                translator={_ => String(_).toUpperCase()}
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
