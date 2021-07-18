import React from "react";
import {UserOutlined} from "@ant-design/icons";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {BoolSwitch} from "@pinnacle0/web-ui/core/BoolSwitch";
import {DateRangePicker} from "@pinnacle0/web-ui/core/DateRangePicker";
import {DateTimePicker} from "@pinnacle0/web-ui/core/DateTimePicker";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {AmountRangeInput} from "@pinnacle0/web-ui/core/AmountRangeInput";
import {EnumRadio} from "@pinnacle0/web-ui/core/EnumRadio";
import {Checkbox} from "@pinnacle0/web-ui/core/Checkbox";
import {AmountConditionInput, Operator} from "@pinnacle0/web-ui/core/AmountConditionInput";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";
import {dummyEmptyCallback} from "../../dummy/dummyCallback";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {Amount} from "../../../../../src/core/Amount";

const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);
const UncontrolledEnumRadio = withUncontrolledInitialValue(EnumRadio);
const UncontrolledCheckbox = withUncontrolledInitialValue(Checkbox);
const UncontrolledInput = withUncontrolledInitialValue(Input);
const UncontrolledInputTextArea = withUncontrolledInitialValue(Input.TextArea);
const UncontrolledInputPassword = withUncontrolledInitialValue(Input.Password);
const UncontrolledAmountConditionInput = withUncontrolledInitialValue(AmountConditionInput);
const UncontrolledCascader = withUncontrolledInitialValue(Cascader);
const UncontrolledDateRangePicker = withUncontrolledInitialValue(DateRangePicker);
const UncontrolledDateTimePicker = withUncontrolledInitialValue(DateTimePicker);
const UncontrolledBoolSwitch = withUncontrolledInitialValue(BoolSwitch.YesNo);

const FormItems = () => {
    return (
        <React.Fragment>
            <Form.Item label="Text">Some simple string</Form.Item>
            <Form.Item label="Digit">
                <Amount scale={4} value={-43242} colorScheme="green-red+" />
            </Form.Item>
            <Form.Item label="Username" validator={() => "username incorrect"}>
                <UncontrolledInput initialValue="username" />
            </Form.Item>
            <Form.Item label={<UserOutlined />} required>
                <UncontrolledInput initialValue="" />
            </Form.Item>
            <Form.Item label="Fixture" required>
                <UncontrolledInput initialValue="40" prefix=">" suffix="$" />
            </Form.Item>
            <Form.Item label=">Input<" widthMode="shrink">
                <UncontrolledInput initialValue="" />
            </Form.Item>
            <Form.Item label="<Input>" widthMode="fill">
                <UncontrolledInput initialValue="" />
            </Form.Item>
            <Form.Item label="Number 1" required>
                <NumberInput value={20} scale={1} allowNull={false} onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label="Number 2" required>
                <NumberInput value={30} scale={0} allowNull={false} onChange={dummyEmptyCallback} prefix="<" suffix="$" />
            </Form.Item>
            <Form.Item label="Number 3">
                <NumberInput value={24} scale={2} step={0.05} stepperMode="always" allowNull={false} onChange={dummyEmptyCallback} />
            </Form.Item>
            <Form.Item label=">Number<" widthMode="shrink">
                <NumberInput value={30} scale={0} allowNull={false} onChange={dummyEmptyCallback} prefix="<" suffix="$" />
            </Form.Item>
            <Form.Item label="<Number>" widthMode="fill">
                <NumberInput value={30} scale={0} allowNull={false} onChange={dummyEmptyCallback} prefix="<" suffix="$" />
            </Form.Item>
            <Form.Item label="Numbers">
                <AmountRangeInput value={[2, 50]} onChange={dummyEmptyCallback} allowNull={false} />
            </Form.Item>
            <Form.Item label="Operator">
                <UncontrolledAmountConditionInput initialValue={{condition: Operator.GREATER_EQUAL, amount: 20}} scale={1} />
            </Form.Item>
            <Form.Item label="Password">
                <UncontrolledInputPassword initialValue="password" />
            </Form.Item>
            <Form.Item label="Bio" validator={() => "bio information too long"}>
                <UncontrolledInputTextArea initialValue="Here is my bio ..." />
            </Form.Item>
            <Form.Item label="Multiple" validator={() => "test"} widthMode="shrink">
                <Input.Group>
                    <UncontrolledInputPassword initialValue="password" />
                    <UncontrolledDateTimePicker initialValue={new Date()} allowNull={false} />
                </Input.Group>
            </Form.Item>
            <Form.Item label="Flag">
                <UncontrolledBoolSwitch initialValue={false} />
            </Form.Item>
            <Form.Item label="Checkbox">
                <UncontrolledCheckbox initialValue={false} />
            </Form.Item>
            <Form.Item label="Radio">
                <UncontrolledEnumRadio initialValue="+" list={["+", "-", "*", "/"]} />
            </Form.Item>
            <Form.Item label="Selector" validator={() => "selector test"}>
                <UncontrolledEnumSelect initialValue="+" list={["+", "-", "*", "/"]} />
            </Form.Item>
            <Form.Item label=">Selector<" widthMode="shrink">
                <UncontrolledEnumSelect initialValue="+" list={["+", "-", "*", "/"]} />
            </Form.Item>
            <Form.Item label="<Selector>" widthMode="fill">
                <UncontrolledEnumSelect initialValue="+" list={["+", "-", "*", "/"]} />
            </Form.Item>
            <Form.Item label="Cascader">
                <UncontrolledCascader
                    initialValue="a"
                    canSelectAnyLevel
                    data={[
                        {label: "A", value: "a"},
                        {label: "B", value: "b", children: [{label: "B1", value: "b1"}]},
                    ]}
                />
            </Form.Item>
            <Form.Item label="Date">
                <UncontrolledDateTimePicker initialValue={new Date()} allowNull={false} />
            </Form.Item>
            <Form.Item label=">Date<" widthMode="shrink">
                <UncontrolledDateTimePicker initialValue={new Date()} allowNull={false} />
            </Form.Item>
            <Form.Item label="<Date>" widthMode="fill">
                <UncontrolledDateTimePicker initialValue={new Date()} allowNull={false} />
            </Form.Item>
            <Form.Item label="Range">
                <UncontrolledDateRangePicker initialValue={["2020-01-01", "2020-05-22"]} allowNull={false} />
            </Form.Item>
            <Form.Item label=">Range<" widthMode="shrink">
                <UncontrolledDateRangePicker initialValue={["2020-01-01", "2020-05-22"]} allowNull={false} />
            </Form.Item>
            <Form.Item label="<Range>" widthMode="fill">
                <UncontrolledDateRangePicker initialValue={["2020-01-01", "2020-05-22"]} allowNull={false} />
            </Form.Item>
        </React.Fragment>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Horizontal Layout",
        showPropsHint: false,
        components: [
            <Form layout="horizontal" style={{width: 520}} onFinish={() => {}}>
                <FormItems />
            </Form>,
        ],
    },
    {
        title: "Vertical Layout",
        showPropsHint: false,
        components: [
            <Form layout="vertical" style={{width: 900, backgroundColor: "#eee"}}>
                <FormItems />
            </Form>,
        ],
    },
    {
        title: "Inline Layout",
        showPropsHint: false,
        components: [
            <Form layout="inline" errorDisplayMode={{type: "popover", placement: "top"}}>
                <FormItems />
            </Form>,
        ],
    },
    {
        title: "Inline Layout without submit button",
        showPropsHint: false,
        components: [
            <Form layout="inline" errorDisplayMode={{type: "popover", placement: "top"}} buttonRenderer={null}>
                <FormItems />
            </Form>,
        ],
    },
    {
        title: "Inline Layout with loading submit button",
        showPropsHint: false,
        components: [
            <Form layout="inline" errorDisplayMode={{type: "popover", placement: "top"}} loading>
                <Form.Item>
                    <UncontrolledInput initialValue="loading" />
                </Form.Item>
            </Form>,
        ],
    },
];

export const FormDemo = () => {
    return <DemoHelper groups={groups} />;
};
