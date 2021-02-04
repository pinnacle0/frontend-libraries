import type {Props} from "@pinnacle0/web-ui/core/NumberInput";
import {NumberInput} from "@pinnacle0/web-ui/core/NumberInput";
import type {Meta, Story} from "@storybook/react";
import React from "react";

type P = Props<any>;

export default {
    title: "core/NumberInput",
    component: NumberInput,
    argTypes: {
        value: {
            control: {type: "number"},
        },
        scale: {
            control: {type: "number"},
        },
        min: {
            control: {type: "number"},
        },
        max: {
            control: {type: "number"},
        },
        step: {
            control: {type: "number"},
        },
        stepperMode: {
            control: {type: "inline-radio", options: ["none", "always", "hover"]},
            defaultValue: "none",
        },
        editable: {
            control: {type: "boolean"},
        },
        disabled: {
            control: {type: "boolean"},
        },
        allowNull: {
            control: {type: "boolean"},
        },
    },
} as Meta<P>;

const Template: Story<P> = args => {
    const [value, setValue] = React.useState(args.value);
    return (
        <NumberInput
            {...args}
            value={value}
            onChange={newValue => {
                args.onChange(newValue);
                setValue(newValue);
            }}
        />
    );
};

export const NonNullable = Template.bind({});
NonNullable.args = {value: 0};
NonNullable.argTypes = {
    value: {description: "Value of input field"},
};

export const Nullable = Template.bind({});
Nullable.args = {value: null, allowNull: true};
