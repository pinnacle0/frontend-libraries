import React from "react";
import type {TabItem, Props as TabsProps} from "../Tabs";
import {Tabs} from "../Tabs";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

export interface TabData {
    title: React.ReactElement | string;
    content: React.ReactNode;
    display?: "default" | "hidden";
    disabled?: boolean;
}

export type TypedTabMap<T extends string> = Record<T, TabData>;

export type TypedTabList<T extends string> = Array<TabData & {key: T}>;

export interface Props<T extends string> extends Omit<TabsProps, "onChange"> {
    tabs: TypedTabMap<T> | TypedTabList<T>;
    activeKey: T;
    onChange: (tab: T) => void;
}

export const TypedTabs = ReactUtil.memo("TypedTabs", <T extends string>(props: Props<T>) => {
    const {
        tabs,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in restProps
        children,
        onChange,
        ...restProps
    } = props;
    const tabList = Array.isArray(tabs) ? tabs : Object.entries<TabData>(tabs).map(([key, item]) => ({key, ...item}));
    const tabItems: TabItem[] = tabList
        .filter(_ => _.display !== "hidden")
        .map(tab => ({
            label: tab.title,
            key: tab.key,
            disabled: tab.disabled,
            children: tab.content,
        }));

    return <Tabs onChange={onChange as (_: string) => void} items={tabItems} {...restProps} />;
});
