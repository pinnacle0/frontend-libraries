import React from "react";
import type {TypedTabMap, TypedTabList} from "@pinnacle0/web-ui/core/TypedTabs";
import {TypedTabs} from "@pinnacle0/web-ui/core/TypedTabs";
import {BrowserUtil} from "@pinnacle0/web-ui/util/BrowserUtil";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";

type TabKey = "FB" | "AMZN" | "AAPL" | "NFLX" | "GOOGL" | "MSFT";

const maxVisibleTabCount = 3.5;

const demoTabPaneStyle: React.CSSProperties = {
    textAlign: "center",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "yellow",
    fontWeight: "bold",
    fontSize: 30,
    background: "orange",
};

const tabs: TypedTabMap<TabKey> = {
    FB: {
        title: "FB",
        content: <div style={demoTabPaneStyle}>Facebook, Inc.</div>,
    },
    AMZN: {
        title: "AMZN",
        content: <div style={demoTabPaneStyle}>Amazon, Inc.</div>,
    },
    AAPL: {
        title: "AAPL",
        content: <div style={demoTabPaneStyle}>Apple, Inc.</div>,
    },
    NFLX: {
        title: "NFLX",
        content: <div style={demoTabPaneStyle}>Netflix, Inc.</div>,
    },
    GOOGL: {
        title: "GOOGL",
        content: <div style={demoTabPaneStyle}>Alphabet Inc.</div>,
    },
    MSFT: {
        title: "MSFT",
        content: <div style={demoTabPaneStyle}>Microsoft Corporation</div>,
    },
};

const Card = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");
    return <TypedTabs activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
};

const Line = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");
    return <TypedTabs type="line" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />;
};

const LineWithMaxVisible = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");
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
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");

    const mobileStyle: React.CSSProperties = BrowserUtil.isMobile()
        ? {
              position: "absolute",
              top: 0,
              left: 0,
              height: "100vh",
              backgroundColor: "white",
          }
        : {};

    return (
        <div style={{...mobileStyle, width: 380}}>
            <TypedTabs swipeable initialMaxVisibleTabCount={maxVisibleTabCount} type="card" activeKey={activeKey} onChange={setCurrentKey} tabs={tabs} />
        </div>
    );
};

const WithExtra = () => {
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");
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
    const [activeKey, setCurrentKey] = React.useState<TabKey>("FB");
    const tabsInArray: TypedTabList<TabKey> = [
        {
            key: "FB",
            title: "FB",
            content: <div>FB content 1</div>,
        },
        {
            key: "AMZN",
            title: "AMZN",
            content: <div>AMZN content 2</div>,
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
