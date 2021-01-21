import React from "react";
import {Foldable} from "@pinnacle0/web-ui/core/Foldable";
import type {Props as FoldableProps} from "@pinnacle0/web-ui/core/Foldable";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const ControlledFoldable = (props: Omit<FoldableProps, "expanded" | "onExpansionChange">) => {
    const [expanded, onExpansionChange] = React.useState<boolean>(false);
    return <Foldable {...props} expanded={expanded} onExpansionChange={onExpansionChange} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Foldable",
        components: [
            <ControlledFoldable title="Title1" style={{width: 400}}>
                <div style={{backgroundColor: "red", height: 150, width: "100%"}} />
            </ControlledFoldable>,
            "-",
            <ControlledFoldable title="Title2" titleRight="TitleRight2" style={{width: 400}}>
                <div style={{backgroundColor: "green", color: "#eee", width: "100%", padding: 10}}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
            </ControlledFoldable>,
            "-",
            <ControlledFoldable title="Title3" titleRight="TitleRight3" style={{width: 400}}>
                <div style={{backgroundColor: "blue", height: 150, width: "100%"}} />
            </ControlledFoldable>,
        ],
    },
];

export const FoldableDemo = () => <DemoHelper groups={groups} />;
