import React from "react";
import type {Props as TabsProps} from "./Tabs";
import {Tabs} from "./Tabs";

export interface TabData {
    title: React.ReactElement | string;
    content: React.ReactElement;
    display?: "default" | "hidden";
}

export type TypedTabMap<T extends string> = Record<T, TabData>;

export type TypedTabList<T extends string> = Array<TabData & {key: T}>;

export interface Props<T extends string> extends Omit<TabsProps, "onChange"> {
    tabs: TypedTabMap<T> | TypedTabList<T>;
    activeKey: T;
    onChange: (tab: T) => void;
}

export class TypedTabs<T extends string> extends React.PureComponent<Props<T>> {
    static displayName = "TypedTabs";

    render() {
        const {tabs, children, onChange, type, ...restProps} = this.props;
        const tabList = Array.isArray(tabs) ? tabs : Object.entries<TabData>(tabs).map(([key, item]) => ({key, ...item}));
        return (
            <Tabs type={type} animated={type === "line"} onChange={onChange as (_: string) => void} {...restProps}>
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
