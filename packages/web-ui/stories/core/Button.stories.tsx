import type {ButtonColor, ButtonSize, Props} from "@pinnacle0/web-ui/core/Button";
import {Button} from "@pinnacle0/web-ui/core/Button";
import type {Meta, Story} from "@storybook/react";
import React from "react";

type P = Props<ButtonColor, ButtonSize>;

export default {
    title: "core/Button",
    component: Button,
    argTypes: {
        size: {
            control: {type: "inline-radio", options: ["small", "medium", "large", "x-large"]},
            defaultValue: "medium",
        },
        color: {
            control: {type: "inline-radio", options: ["primary", "wire-frame", "green", "red"]},
            defaultValue: "primary",
        },
        onClick: {
            action: "onClick",
        },
    },
} as Meta<P>;

const template: Story<P> = args => <Button {...args}>Click me</Button>;

export const Primary = template.bind({});

export const WireFrame = template.bind({});
WireFrame.storyName = "Wire-frame";
WireFrame.args = {color: "wire-frame"};

export const Green = template.bind({});
Green.args = {color: "green"};

export const Red = template.bind({});
Red.args = {color: "red"};

export const Link = template.bind({});
Link.args = {
    link: "https://www.google.com",
    linkInNewTab: true,
};
