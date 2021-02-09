import React from "react";
import {Breadcrumb} from "@pinnacle0/web-ui/core/Breadcrumb";
import type {Props} from "@pinnacle0/web-ui/core/Breadcrumb";
import type {Meta, Story} from "@storybook/react";

interface DataType {
    title: string;
}

const data: DataType[] = [...new Array(3)].map((_, i) => ({title: `Segment ${i + 1}`}));

export default {
    title: "core/Breadcrumb",
    component: Breadcrumb,
    argTypes: {
        data: {
            defaultValue: data,
        },
        renderItem: {
            defaultValue: (_ => _.title) as Props<DataType>["renderItem"],
        },
        lastClickable: {
            control: "boolean",
        },
        className: {
            control: "string",
        },
        style: {
            control: "object",
        },
    },
} as Meta<Props<DataType>>;

export const Primary: Story<Props<DataType>> = args => <Breadcrumb {...args} />;
Primary.storyName = "Breadcrumb";
