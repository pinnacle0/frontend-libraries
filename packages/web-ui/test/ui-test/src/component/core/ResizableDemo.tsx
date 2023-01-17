import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {Resizable} from "@pinnacle0/web-ui/core/Resizable";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Test",
        components: [
            <Resizable height={200} width={200} maxHeight={800} maxWidth={800} x={300} y={400}>
                I am resizable
            </Resizable>,
        ],
    },
];

export const ResizableDemo = () => <DemoHelper groups={groups} />;
