import type {Props} from "@pinnacle0/web-ui/core/Amount";
import {Amount} from "@pinnacle0/web-ui/core/Amount";
import type {Meta, Story} from "@storybook/react";
import React from "react";

export default {
    title: "core/Amount",
    component: Amount,
    argTypes: {
        scale: {
            control: {
                type: "number",
                min: 0,
            },
            defaultValue: 2,
        },
        value: {
            control: "number",
            defaultValue: 100,
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
        postfix: {
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

export const Primary: Story<Props> = args => <Amount {...args} />;
Primary.storyName = "Amount";
