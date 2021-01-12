import React from "react";
import type {DemoHelperGroupConfig} from "../../DemoHelper";
import {DemoHelper} from "../../DemoHelper";
import type {ButtonColor, ButtonSize} from "@pinnacle0/web-ui/core/Button";
import {Button} from "@pinnacle0/web-ui/core/Button";

const colors: ButtonColor[] = ["primary", "wire-frame", "green", "red"];

const coloredButtons = (size: ButtonSize): React.ReactElement[] => {
    const buttons = colors.map(color => (
        <Button size={size} color={color}>
            {color}
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
            ...coloredButtons("small"),
            "-",
            ...coloredButtons("medium"),
            "-",
            ...coloredButtons("large"),
            "-",
            ...coloredButtons("x-large"),
            "-",
            <Button visible={false}>Should not show</Button>,
            <Button visible>Should show</Button>,
        ],
    },
];

export const ButtonDemo = () => <DemoHelper groups={groups} />;
