import React from "react";
import AntTabs from "antd/es/tabs";
import {classNames} from "../../util/ClassNames";
import {Single} from "./Single";
import type {TabsProps} from "antd/es/tabs";
import {ReactUtil} from "../../util/ReactUtil";

export interface Props extends Omit<TabsProps, "tabBarExtraContent"> {
    tabBarPrefix?: React.ReactNode;
    tabBarSuffix?: React.ReactNode;
    /**
     * Attention:
     *  - Should be at least 1
     *  - No effect if tabs count < initialMaxVisibleTabCount
     *  - Not work when used together with customized props.renderTabBar
     *  - Will not recalculate tab width when resize after mount
     */
    initialMaxVisibleTabCount?: number;
}

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

export const Tabs = ReactUtil.compound("Tabs", {Single}, (props: Props) => {
    const {tabBarPrefix, tabBarSuffix, initialMaxVisibleTabCount, className, renderTabBar, type = "card", animated, ...restProps} = props;
    const tabBarRef = React.useRef<HTMLDivElement>(null);

    const resizeTabs = React.useCallback(() => {
        if (initialMaxVisibleTabCount && initialMaxVisibleTabCount >= 1) {
            const tabBarWidth = tabBarRef.current?.getBoundingClientRect().width;
            const tabNodes = tabBarRef.current?.querySelectorAll<HTMLDivElement>(".ant-tabs-nav-list > .ant-tabs-tab");
            if (tabBarWidth && tabNodes && tabNodes.length > initialMaxVisibleTabCount) {
                const singleTabWidth = tabBarWidth / initialMaxVisibleTabCount;
                Array.from(tabNodes).forEach(tabNode => (tabNode.style.width = `${singleTabWidth}px`));
            }
        }
    }, [initialMaxVisibleTabCount]);

    React.useEffect(() => {
        resizeTabs();
        window.addEventListener("resize", resizeTabs);
        return () => {
            window.removeEventListener("resize", resizeTabs);
        };
    }, [resizeTabs]);

    // Passing {} or {left:undefined} to <AntTabs tabBarExtraContent> will lead to error
    let tabBarExtraContent: TabsProps["tabBarExtraContent"];
    if (tabBarPrefix || tabBarSuffix) {
        tabBarExtraContent = {};
        if (tabBarPrefix) tabBarExtraContent.left = tabBarPrefix;
        if (tabBarSuffix) tabBarExtraContent.right = tabBarSuffix;
    }

    return (
        <AntTabs
            className={classNames("g-tabs", className, {"with-max-visible-tab-count": initialMaxVisibleTabCount})}
            animated={animated === undefined ? type === "line" : animated}
            type={type}
            tabBarExtraContent={tabBarExtraContent}
            // DefaultTabBar is a React.ForwardRef component but mark as a React.ComponentType by antd, needed to change the type  to 'any' in order to assign ref
            renderTabBar={renderTabBar || ((oldProps, DefaultTabBar: any) => <DefaultTabBar {...oldProps} ref={(ref: any) => (tabBarRef.current = ref)} />)}
            {...restProps}
        />
    );
});
