import type {Props} from "@pinnacle0/web-ui/core/Amount/AmountPercentage";
import {AmountPercentage} from "@pinnacle0/web-ui/core/Amount/AmountPercentage";
import type {Meta, Story} from "@storybook/react";
import React from "react";

export default {
    title: "core/Amount/AmountPercentage",
    component: AmountPercentage,
    argTypes: {
        percentageScale: {
            control: {
                type: "number",
                min: 0,
            },
            defaultValue: 2,
        },
        value: {
            control: "number",
            defaultValue: 1,
        },
        floorRounding: {
            control: "boolean",
        },
        withPlusSignForPositive: {
            control: "boolean",
        },
        withThousandSplitter: {
            control: "boolean",
        },
        nullText: {
            control: "text",
        },
        prefix: {
            control: "text",
        },
        colorScheme: {
            control: {
                type: "inline-radio",
                options: [undefined, "green-red", "highlight", "highlight-for-positive"],
            },
        },
        underline: {
            control: "boolean",
        },
        del: {
            control: "boolean",
        },
    },
} as Meta<Props>;

const Template: Story<Props> = args => <AmountPercentage {...args} />;

export const Percentage = Template.bind({});
Percentage.storyName = "AmountPercentage";
