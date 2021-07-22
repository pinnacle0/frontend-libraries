import React from "react";
import type {TypedTabMap, TypedTabList} from "@pinnacle0/web-ui/core/TypedTabs";
import {TypedTabs} from "@pinnacle0/web-ui/core/TypedTabs";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

type TabKey = "700" | "9988" | "1030" | "1755" | "2202" | "3908";

const maxVisibleTabCount = 3.5;
const tabs: TypedTabMap<TabKey> = {
    "700": {
        title: "700.HK",
        content: <div>Tencent Holdings Ltd.</div>,
    },
    "9988": {
        title: "9988.HK",
        content: <div>Alibaba Group Holding Ltd.</div>,
    },
    "1030": {
        title: "1030.HK",
        content: <div>SEAZEN Holdings Co. Ltd.</div>,
    },
    "1755": {
        title: "1755.HK",
        content: <div>S-Enjoy Service Group Co. Ltd</div>,
    },
    "2202": {
        title: "2202.HK",
        content: <div>China Vanke Co. Ltd</div>,
    },
    "3908": {
        title: "3908.HK",
        content: <div> China International Capital Co. Ltd </div>,
    },
};

const Card = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    return <TypedTabs activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
};

const Line = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    return <TypedTabs type="line" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
};

const LineWithMaxVisible = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    return (
        <div style={{width: 550, height: 300, backgroundColor: "#cc6", padding: 12}}>
            <TypedTabs
                style={{backgroundColor: "#ffffff"}}
                tabBarStyle={{backgroundColor: "#efefe2"}}
                initialMaxVisibleTabCount={maxVisibleTabCount}
                type="line"
                activeKey={activeKey}
                onChange={setCurrentKey}
                tabs={tabs}
            />
        </div>
    );
};

const CardWithMaxVisible = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    return (
        <div style={{width: 380}}>
            <TypedTabs initialMaxVisibleTabCount={maxVisibleTabCount} type="card" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />
        </div>
    );
};

const WithExtra = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    return (
        <TypedTabs
            type="line"
            activeKey={activeKey}
            onChange={setCurrentKey}
            tabs={tabs}
            tabBarPrefix={<div style={{width: 40, height: 40, background: "blue"}}>Left</div>}
            tabBarSuffix={<div style={{width: 40, height: 40, background: "red"}}>Right</div>}
        />
    );
};

const ArrayMode = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("700");
    const tabsInArray: TypedTabList<TabKey> = [
        {
            key: "700",
            title: "700",
            content: <div>700 content 1</div>,
        },
        {
            key: "1755",
            title: "1755",
            content: <div>1755 content 2</div>,
        },
    ];
    return <TypedTabs activeKey={activeKey} onChange={setCurrentKey} tabs={tabsInArray} />;
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Simple Tabs",
        showPropsHint: false,
        components: [<Card />, "-", <Line />, "-", <ArrayMode />],
    },
    {
        title: "With Extra",
        showPropsHint: false,
        components: [<WithExtra />],
    },
    {
        title: `With Max Visible (${maxVisibleTabCount})`,
        showPropsHint: false,
        components: [<LineWithMaxVisible />, "-", <CardWithMaxVisible />],
    },
];

export const TabsDemo = () => <DemoHelper groups={groups} />;
