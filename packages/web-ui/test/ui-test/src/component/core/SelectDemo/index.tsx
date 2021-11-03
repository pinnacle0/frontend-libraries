import React from "react";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {MultipleEnumSelect} from "@pinnacle0/web-ui/core/MultipleEnumSelect";
import {BoolRadio} from "@pinnacle0/web-ui/core/BoolRadio";
import {Select} from "@pinnacle0/web-ui/core/Select";
import {withUncontrolledInitialValue} from "../../../util/withUncontrolledInitialValue";
import {DemoHelper} from "../../DemoHelper";
import type {DemoHelperGroupConfig} from "../../DemoHelper";

const UncontrolledEnumRadio = withUncontrolledInitialValue(EnumRadio);
const UncontrolledBoolRadio = withUncontrolledInitialValue(BoolRadio);
const UncontrolledEnumRadioNullable = withUncontrolledInitialValue(EnumRadio.Nullable);
const UncontrolledEnumRadioInitialNullable = withUncontrolledInitialValue(EnumRadio.InitialNullable);
const UncontrolledMultipleSelect = withUncontrolledInitialValue(MultipleEnumSelect);
const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);
const UncontrolledEnumSelectNullable = withUncontrolledInitialValue(EnumSelect.Nullable);
const UncontrolledEnumSelectInitialNullable = withUncontrolledInitialValue(EnumSelect.InitialNullable);

enum TestEnum {
    ONE,
    TWO,
    THREE,
}

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Enum Radio Demo",
        components: [<UncontrolledEnumRadio list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} />],
    },
    {
        title: "Nullable Enum Radio Demo",
        components: [<UncontrolledEnumRadioNullable list={[1, 2, 3]} translator={_ => _ + ""} initialValue={1} />],
    },
    {
        title: "Initial Nullable Enum Radio Demo",
        components: [<UncontrolledEnumRadioInitialNullable list={[1, 2, 3]} translator={_ => _ + ""} initialValue={null} />],
    },
    {
        title: "Enum Radio Button Demo",
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
        components: [<UncontrolledBoolRadio allowNull initialValue={null} />],
    },
    {
        title: "Boolean Radio Initial Nullable",
        components: [<UncontrolledBoolRadio initialValue />],
    },
    {
        title: "Select",
        components: [
            <Select
                options={[
                    {
                        label: "blah blah",
                        value: "blah",
                        disabled: true,
                    },
                ]}
                style={{width: 200}}
            />,
        ],
    },
    {
        title: "MultipleEnumSelect",
        components: [<UncontrolledMultipleSelect list={["apple", "boy", "c++"]} translator={_ => _.toString()} initialValue={["apple"]} style={{width: 200}} />],
    },
    {
        title: "Enum Dropdown Demo",
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
        title: "Nullable Enum Dropdown Demo",
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
        title: "Initial Nullable Enum Dropdown Demo",
        components: [
            <UncontrolledEnumSelectInitialNullable
                list={["apple🍏", "banana🍌", "canadian🍁", "donki🐧"]}
                initialValue={null}
                placeholder="Please select ..."
                translator={_ => String(_).toUpperCase()}
                style={{
                    width: 200,
                }}
            />,
        ],
    },
];

export const SelectDemo = () => <DemoHelper groups={groups} />;
