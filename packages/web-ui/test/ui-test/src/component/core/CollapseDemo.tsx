import React from "react";
import {Collapse} from "@pinnacle0/web-ui/core/Collapse";
import type {Props as CollapseProps, CollapseItemsProps} from "@pinnacle0/web-ui/core/Collapse";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

const items: CollapseItemsProps = [
    {key: "1", label: "Title1", children: <div style={{backgroundColor: "red", height: 150, width: "100%"}} />},
    {key: "2", label: "Title2", children: <div style={{backgroundColor: "green", color: "#eee", width: "100%", padding: 10}}>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>},
    {key: "3", label: "Title3", children: <div style={{backgroundColor: "blue", height: 150, width: "100%"}} />},
];

const ControlledCollapse = (props: Omit<CollapseProps, "expanded" | "onExpansionChange">) => {
    return <Collapse {...props} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Collapse",
        components: [<ControlledCollapse style={{width: 400}} items={items} defaultActiveKey="2" />],
    },
];

export const CollapseDemo = () => <DemoHelper groups={groups} />;
