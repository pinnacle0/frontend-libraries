import React from "react";
import {DemoHelper, DemoHelperGroupConfig} from "../DemoHelper";
import {Form} from "@pinnacle0/web-ui/core/Form";
import {Input, Props as InputProps, InputTextAreaProps} from "@pinnacle0/web-ui/core/Input";
import {FormContainer} from "@pinnacle0/web-ui/core/FormContainer";
import {dummyEmptyCallback} from "@pinnacle0/web-ui-test/ui-test/util/dummyCallback";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {EnumSelect} from "@pinnacle0/web-ui/core/EnumSelect";
import {withUncontrolledInitialValue} from "../../util/withUncontrolledInitialValue";

const UncontrolledTextarea = (props: Omit<InputTextAreaProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<string>("");
    return <Input.TextArea {...props} value={value} onChange={onChange} />;
};

const UncontrolledInput = (props: Omit<InputProps, "value" | "onChange">) => {
    const [value, onChange] = React.useState<string>("");
    return <Input {...props} value={value} onChange={onChange} />;
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
];

export const FormDemo = () => {
    return <DemoHelper groups={groups} />;
};
