import React from "react";
import {TypedTabs, TypedTabMap, TypedTabList, TabData} from "@pinnacle0/web-ui/core/TypedTabs";

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
