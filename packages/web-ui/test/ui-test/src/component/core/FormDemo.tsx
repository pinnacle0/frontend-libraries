import React from "react";
import {Form} from "@pinnacle0/web-ui/core/Form";
import type {Props as InputProps, InputTextAreaProps} from "@pinnacle0/web-ui/core/Input";
import {Input} from "@pinnacle0/web-ui/core/Input";
import {FormContainer} from "@pinnacle0/web-ui/core/FormContainer";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {BoolSwitch} from "@pinnacle0/web-ui/core/BoolSwitch";
import {UserOutlined} from "@ant-design/icons";
import {dummyEmptyCallback} from "../../dummy/dummyCallback";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const UncontrolledTextarea = (props: Omit<InputTextAreaProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<string>("");
    return <Input.TextArea {...props} value={value} onChange={onChange} />;
};

const UncontrolledInput = (props: Omit<InputProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<string>("");
    return <Input {...props} value={value} onChange={onChange} />;
};

const UncontrolledBoolSwitch = (props: Omit<InputProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<boolean>(false);
    return <BoolSwitch.YesNo {...props} value={value} onChange={onChange} />;
};

const PasswordInput = (props: Omit<InputProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<string>("");
    return <Input.Password {...props} value={value} onChange={onChange} />;
};

const UncontrolledEnumSelect = withUncontrolledInitialValue(EnumSelect);

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Pure Form (Vertical Layout)",
        showPropsHint: false,
        components: [
            <Form layout="vertical">
                <Form.Item label="Username">
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item label="Password">
                    <PasswordInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
            <Form layout="vertical">
                <Form.Item label="Multi-children form item">
                    <UncontrolledInput />
                    <PasswordInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
        ],
    },
    {
        title: "Pure Form (Horizontal Layout)",
        showPropsHint: false,
        components: [
            <Form layout="horizontal">
                <Form.Item label="Username">
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item label="Password">
                    <PasswordInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
            "-",
            <Form layout="horizontal">
                <Form.Item label="Username">
                    <UncontrolledInput />
                    <PasswordInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
        ],
    },
    {
        title: "Pure Form (Inline Layout)",
        showPropsHint: false,
        components: [
            <Form layout="inline">
                <Form.Item label="Username">
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item label="Password">
                    <PasswordInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
            "-",
            <Form layout="inline">
                <Form.Item label="Username">
                    <UncontrolledEnumSelect list={["+", "_"]} translator={_ => _.toString()} initialValue="+" />
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item>
                    <Button>Submit</Button>
                </Form.Item>
            </Form>,
        ],
    },
    {
        title: "Form Item Vertical Alignment",
        showPropsHint: true,
        components: [
            <Form layout="horizontal">
                <Form.Item label="Horizontal">
                    <UncontrolledBoolSwitch />
                </Form.Item>
            </Form>,
            "-",
            <Form layout="vertical">
                <Form.Item label="Vertical">
                    <UncontrolledBoolSwitch />
                </Form.Item>
            </Form>,
            "-",
            <Form layout="inline">
                <Form.Item label="Inline">
                    <UncontrolledBoolSwitch />
                </Form.Item>
            </Form>,
        ],
    },
    {
        title: "FormContainer With Validation (Extra Mode)",
        showPropsHint: false,
        components: [
            <FormContainer onFinish={dummyEmptyCallback}>
                <Form.Item label="Username" validator={() => "Username Incorrect!"} extra="You can put extra element here">
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item label="Password" validator={() => "Password Incorrect!"} extra="You can put extra element here">
                    <PasswordInput />
                </Form.Item>
                <Form.Item label="Content" validator={() => "Content is Empty!"}>
                    <UncontrolledTextarea />
                </Form.Item>
            </FormContainer>,
        ],
    },
    {
        title: "FormContainer With Validation (Popover Mode)",
        showPropsHint: false,
        components: [
            <FormContainer errorDisplayMode={{type: "popover"}} onFinish={dummyEmptyCallback}>
                <Form.Item label="Username" validator={() => "Username Incorrect!"} extra="You can put extra element here">
                    <UncontrolledInput />
                </Form.Item>
                <Form.Item label="Password" validator={() => "Password Incorrect!"} extra="You can put extra element here">
                    <PasswordInput />
                </Form.Item>
            </FormContainer>,
        ],
    },
    {
        title: "Form With icon label",
        showPropsHint: false,
        components: [
            <React.Fragment>
                <FormContainer errorDisplayMode={{type: "popover"}} onFinish={dummyEmptyCallback}>
                    <Form.Item required label={<UserOutlined />} validator={() => "Username Incorrect!"} extra="You can put extra element here">
                        <UncontrolledInput />
                    </Form.Item>
                </FormContainer>
                <Form layout="vertical">
                    <Form.Item label={<UserOutlined />} validator={() => "Username Incorrect!"}>
                        <UncontrolledInput />
                    </Form.Item>
                </Form>
            </React.Fragment>,
        ],
    },
];

export const FormDemo = () => {
    return <DemoHelper groups={groups} />;
};
