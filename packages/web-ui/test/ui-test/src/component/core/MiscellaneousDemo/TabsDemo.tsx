import React from "react";
import type {TypedTabMap, TypedTabList, TabData} from "@pinnacle0/web-ui/core/TypedTabs";
import {TypedTabs} from "@pinnacle0/web-ui/core/TypedTabs";

type TabsDemoKey = "1" | "2";

const tabs: TypedTabMap<TabsDemoKey> = {
    "1": {
        title: "Title 1",
        content: <div>content 1</div>,
    },
    "2": {
        title: "Title 2",
        content: <div>content 2</div>,
    },
};

type TabsWithMaxVisibleTabCountDemoKey = "700" | "9988" | "1030" | "1755" | "2202" | "3908";

const tabsWithMaxVisibleTabCount: TypedTabMap<TabsWithMaxVisibleTabCountDemoKey> = {
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

const tabsInArray: TypedTabList<TabsDemoKey> = [
    {
        key: "1",
        title: "Array Mode 1",
        content: <div>array content 1</div>,
    },
    {
        key: "2",
        title: "Array Mode 2",
        content: <div>array content 2</div>,
    },
];

export const TabsDemo = {
    Card: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsDemoKey>("1");
        return <TypedTabs activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
    },
    Line: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsDemoKey>("1");
        return <TypedTabs type="line" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
    },
    LineWithMaxVisibleTabCount: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsWithMaxVisibleTabCountDemoKey>("700");
        return <TypedTabs maxVisibleTabCount={4} style={{width: 320}} type="line" activeKey={activeKey} onChange={setCurrentKey} tabs={tabsWithMaxVisibleTabCount} />;
    },
    WithExtra: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsDemoKey>("1");
        return (
            <TypedTabs
                type="line"
                activeKey={activeKey}
                onChange={setCurrentKey}
                tabs={tabs}
                tabBarPrefix={<div style={{width: 25, height: 25, background: "blue"}} />}
                tabBarSuffix={<div style={{width: 25, height: 25, background: "red"}} />}
            />
        );
    },
    Button: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsDemoKey>("1");
        return <TypedTabs type="button" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
    },
    ArrayMode: () => {
        const [activeKey, setCurrentKey] = React.useState<TabsDemoKey>("1");
        return <TypedTabs type="button" activeKey={activeKey} onChange={setCurrentKey} tabs={tabsInArray} />;
    },
    MobileMode: () => {
        const [activeKey, setCurrentKey] = React.useState<string>("0");
        return (
            <div style={{width: 200}}>
                <strong>This only works when user-agent is mobile.</strong>
                <TypedTabs
                    tabs={Array.from<any, TabData & {key: string}>({length: 5}, (_, i) => ({
                        key: `${i}`,
                        title: `m${i}`,
                        content: <div>content {i}</div>,
                    }))}
                    activeKey={activeKey}
                    onChange={setCurrentKey}
                />
            </div>
        );
    },
};
