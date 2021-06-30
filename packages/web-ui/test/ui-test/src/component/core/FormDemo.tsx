import React from "react";
import {UserOutlined} from "@ant-design/icons";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {FormContainer} from "@pinnacle0/web-ui/core/FormContainer";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {BoolSwitch} from "@pinnacle0/web-ui/core/BoolSwitch";
import {DateRangePicker} from "@pinnacle0/web-ui/core/DateRangePicker";
import {DateTimePicker} from "@pinnacle0/web-ui/core/DateTimePicker";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import {Cascader} from "@pinnacle0/web-ui/core/Cascader";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";
import {dummyEmptyCallback} from "../../dummy/dummyCallback";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);
const UncontrolledInput = withUncontrolledInitialValue(Input);
const UncontrolledInputTextArea = withUncontrolledInitialValue(Input.TextArea);
const UncontrolledInputPassword = withUncontrolledInitialValue(Input.Password);
const UncontrolledCascader = withUncontrolledInitialValue(Cascader);
const UncontrolledDateRangePicker = withUncontrolledInitialValue(DateRangePicker);
const UncontrolledDateTimePicker = withUncontrolledInitialValue(DateTimePicker);
const UncontrolledBoolSwitch = withUncontrolledInitialValue(BoolSwitch.YesNo);

const FormItems = () => {
    return (
        <React.Fragment>
            <Form.Item label="Username" validator={() => "username incorrect"}>
                <UncontrolledInput initialValue="username" />
            </Form.Item>
            <Form.Item label={<UserOutlined />} required>
                <UncontrolledInput initialValue="" />
            </Form.Item>
            <Form.Item label="Fixture" required>
                <UncontrolledInput initialValue="40" prefix=">" suffix="$" />
            </Form.Item>
            <Form.Item label="Long Input" fillParentWidth>
                <UncontrolledInput initialValue="long text ..." />
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
            <Form.Item label="Password">
                <UncontrolledInputPassword initialValue="password" />
            </Form.Item>
            <Form.Item label="Bio" validator={() => "bio information too long"}>
                <UncontrolledInputTextArea initialValue="Here is my bio ..." />
            </Form.Item>
            <Form.Item label="Flag">
                <UncontrolledBoolSwitch initialValue={false} />
            </Form.Item>
            <Form.Item label="Selector" validator={() => "selector test"}>
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
            <Form.Item label="Date Range">
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
            <FormContainer layout="horizontal" style={{width: 520}}>
                <FormItems />
            </FormContainer>,
        ],
    },
    {
        title: "Vertical Layout",
        showPropsHint: false,
        components: [
            <FormContainer layout="vertical" style={{width: 600}}>
                <FormItems />
            </FormContainer>,
        ],
    },
    {
        title: "Inline Layout",
        showPropsHint: false,
        components: [
            <FormContainer layout="inline" errorDisplayMode={{type: "popover", placement: "top"}}>
                <FormItems />
            </FormContainer>,
        ],
    },
];

export const FormDemo = () => {
    return <DemoHelper groups={groups} />;
};
