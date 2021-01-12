import React from "react";
import {FoldableContainer} from "@pinnacle0/web-ui/core/FoldableContainer";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Foldable Container",
        components: [
            <FoldableContainer title="Title1" style={{width: 400}}>
                <div style={{backgroundColor: "red", height: 150, width: "100%"}} />
            </FoldableContainer>,
            "-",
            <FoldableContainer title="Title2" titleRight="TitleRight2" style={{width: 400}}>
                <div style={{backgroundColor: "green", color: "#eee", width: "100%", padding: 10}}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
            </FoldableContainer>,
            "-",
            <FoldableContainer title="Title3" titleRight="TitleRight3" style={{width: 400}}>
                <div style={{backgroundColor: "blue", height: 150, width: "100%"}} />
            </FoldableContainer>,
        ],
    },
];

export const FoldableContainerDemo = () => <DemoHelper groups={groups} />;
