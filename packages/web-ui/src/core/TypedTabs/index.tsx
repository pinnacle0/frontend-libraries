import React from "react";
import type {Props as TabsProps} from "../Tabs";
import type {SafeReactChildren} from "../../internal/type";
import {Tabs} from "../Tabs";
import "./index.less";

export interface TabData {
    title: React.ReactElement | string;
    content: SafeReactChildren;
    display?: "default" | "hidden";
}

export type TypedTabMap<T extends string> = Record<T, TabData>;

export type TypedTabList<T extends string> = Array<TabData & {key: T}>;

export interface Props<T extends string> extends Omit<TabsProps, "onChange"> {
    tabs: TypedTabMap<T> | TypedTabList<T>;
    activeKey: T;
    onChange: (tab: T) => void;
    maxVisibleTabCount?: number;
}

export class TypedTabs<T extends string> extends React.PureComponent<Props<T>> {
    static displayName = "TypedTabs";

    tabBar?: Tabs;

    constructor(props: Props<T>) {
        super(props);
    }

    setTabBarRef = (tabBar: Tabs) => {
        this.tabBar = tabBar;
    };

    componentDidMount() {
        this.resizeTabs();

        window.addEventListener("resize", this.resizeTabs);
    }

    componentDidUpdate() {
        this.resizeTabs();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resizeTabs);
    }

    resizeTabs = () => {
        const {maxVisibleTabCount} = this.props;

        if (typeof maxVisibleTabCount === "undefined") {
            return;
        }

        this.tabBar?.resizeTabsWidth(this.tabBar?.getBarWidth() / (maxVisibleTabCount + 0.5)); // resize to show maxVisibleTabCount + 0.5 tabs for mobile screen
    };

    render() {
        const {tabs, children, onChange, type, maxVisibleTabCount, ...restProps} = this.props;
        const tabList = Array.isArray(tabs) ? tabs : Object.entries<TabData>(tabs).map(([key, item]) => ({key, ...item}));

        return (
            <Tabs ref={this.setTabBarRef} type={type} animated={type === "line"} onChange={onChange as (_: string) => void} {...restProps}>
                {tabList
                    .filter(_ => _.display !== "hidden")
                    .map(_ => (
                        <Tabs.TabPane tab={_.title} key={_.key}>
                            {_.content}
                        </Tabs.TabPane>
                    ))}
            </Tabs>
        );
    }
}
