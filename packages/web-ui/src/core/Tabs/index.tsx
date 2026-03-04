import React from "react";
import RcTabs from "@rc-component/tabs";
import "@rc-component/tabs/assets/index.css";
import {classNames} from "../../util/ClassNames";
import {Single} from "./Single";
import {ReactUtil} from "../../util/ReactUtil";

export interface TabItem {
    key: string;
    label: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    children?: React.ReactNode;
    forceRender?: boolean;
    closable?: boolean;
    closeIcon?: React.ReactNode;
    prefixCls?: string;
    tabKey?: string;
    id?: string;
    animated?: boolean;
    active?: boolean;
    destroyInactiveTabPane?: boolean;
}

export interface Props {
    items?: TabItem[];
    activeKey?: string;
    defaultActiveKey?: string;
    onChange?: (activeKey: string) => void;
    type?: "line" | "card" | "editable-card";
    tabBarPrefix?: React.ReactNode;
    tabBarSuffix?: React.ReactNode;
    initialMaxVisibleTabCount?: number;
    className?: string;
    style?: React.CSSProperties;
    animated?: boolean;
    size?: "large" | "middle" | "small";
    centered?: boolean;
    tabPosition?: "top" | "right" | "bottom" | "left";
    destroyInactiveTabPane?: boolean;
    onEdit?: (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: "add" | "remove") => void;
    renderTabBar?: (props: any, DefaultTabBar: any) => React.ReactElement;
    hideAdd?: boolean;
}

export const Tabs = ReactUtil.compound("Tabs", {Single}, (props: Props) => {
    const {tabBarPrefix, tabBarSuffix, initialMaxVisibleTabCount, className, renderTabBar, type = "card", animated, items, ...restProps} = props;
    const tabBarRef = React.useRef<HTMLDivElement>(null);

    const resizeTabs = React.useCallback(() => {
        if (initialMaxVisibleTabCount && initialMaxVisibleTabCount >= 1) {
            const tabBarWidth = tabBarRef.current?.getBoundingClientRect().width;
            const tabNodes = tabBarRef.current?.querySelectorAll<HTMLDivElement>(".rc-tabs-nav-list > .rc-tabs-tab");
            if (tabBarWidth && tabNodes && tabNodes.length > initialMaxVisibleTabCount) {
                const singleTabWidth = tabBarWidth / initialMaxVisibleTabCount;
                Array.from(tabNodes).forEach(tabNode => (tabNode.style.width = `${singleTabWidth}px`));
            }
        }
    }, [initialMaxVisibleTabCount]);

    React.useEffect(() => {
        resizeTabs();
        window.addEventListener("resize", resizeTabs);
        return () => window.removeEventListener("resize", resizeTabs);
    }, [resizeTabs]);

    let extra: any;
    if (tabBarPrefix || tabBarSuffix) {
        extra = {};
        if (tabBarPrefix) extra.left = tabBarPrefix;
        if (tabBarSuffix) extra.right = tabBarSuffix;
    }

    return (
        <RcTabs
            className={classNames("g-tabs", className, {"with-max-visible-tab-count": initialMaxVisibleTabCount})}
            animated={animated === undefined ? type === "line" : animated}
            editable={type === "editable-card" ? {onEdit: (action, info) => props.onEdit?.(info?.key || "", action)} : undefined}
            tabBarExtraContent={extra}
            renderTabBar={renderTabBar || ((oldProps, DefaultTabBar: any) => <DefaultTabBar {...oldProps} ref={(ref: any) => (tabBarRef.current = ref)} />)}
            items={items}
            {...restProps}
        />
    );
});
