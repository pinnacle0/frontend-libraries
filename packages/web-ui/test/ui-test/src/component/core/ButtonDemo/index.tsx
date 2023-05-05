import React from "react";
import {Button} from "@pinnacle0/web-ui/core/Button";
import {DemoHelper} from "../../DemoHelper";
import type {ButtonSize, ButtonType} from "@pinnacle0/web-ui/core/Button";
import type {DemoHelperGroupConfig} from "../../DemoHelper";

const types: ButtonType[] = ["primary", "default", "link", "text", "dashed", "ghost"];

const coloredButtons = (size: ButtonSize, isDanger: boolean = false): React.ReactElement[] => {
    const buttons = types.map(type => (
        <Button size={size} type={type} danger={isDanger}>
            {type}
        </Button>
    ));
    buttons.push(
        <Button size={size} disabled>
            disabled
        </Button>
    );
    return buttons;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Button",
        components: [
            // prettier-reserve
            ...coloredButtons("small"),
            "-",
            ...coloredButtons("small", true),
            "-",
            ...coloredButtons("middle"),
            "-",
            ...coloredButtons("middle", true),
            "-",
            ...coloredButtons("large"),
            "-",
            ...coloredButtons("large", true),
        ],
    },
];

export const ButtonDemo = () => <DemoHelper groups={groups} />;
