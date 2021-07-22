import React from "react";
import type {TabsProps} from "antd/lib/tabs";
import AntTabs from "antd/lib/tabs";
import type {PickOptional, SafeReactChildren} from "../../internal/type";
import type {TabBarExtraMap} from "rc-tabs/lib/interface";
import {Single} from "./Single";
import "antd/lib/tabs/style";
import "./index.less";

export interface Props extends Omit<TabsProps, "tabBarExtraContent"> {
    tabBarPrefix?: SafeReactChildren;
    tabBarSuffix?: SafeReactChildren;
    /**
     * Attention:
     *  - Should be at least 1
     *  - No effect if tabs count < initialMaxVisibleTabCount
     *  - Not work when used together with customized props.renderTabBar
     *  - Will not recalculate tab width when resize after mount
     */
    initialMaxVisibleTabCount?: number;
}

export class Tabs extends React.PureComponent<Props> {
    static displayName = "Tabs";

    static Single = Single;
    static TabPane = AntTabs.TabPane;

    static defaultProps: PickOptional<Props> = {
        type: "card",
    };

    private tabBarRef: HTMLDivElement | null = null;

    componentDidMount() {
        this.resizeTabs();
    }

    resizeTabs = () => {
        const {initialMaxVisibleTabCount} = this.props;
        if (initialMaxVisibleTabCount && initialMaxVisibleTabCount >= 1) {
            const tabBarWidth = this.tabBarRef?.getBoundingClientRect().width;
            const tabNodes = this.tabBarRef?.querySelectorAll<HTMLDivElement>(".ant-tabs-nav-list > .ant-tabs-tab");
            if (tabBarWidth && tabNodes && tabNodes.length > initialMaxVisibleTabCount) {
                const singleTabWidth = tabBarWidth / initialMaxVisibleTabCount;
                Array.from(tabNodes).forEach(tabNode => (tabNode.style.width = `${singleTabWidth}px`));
            }
        }
    };

    tabBarCallBackRef = (tabBar: HTMLDivElement | null) => (this.tabBarRef = tabBar);

    render() {
        const {tabBarPrefix, tabBarSuffix, initialMaxVisibleTabCount, className, renderTabBar, type, animated, ...restProps} = this.props;

        // Passing {} or {left:undefined} to <AntTabs tabBarExtraContent> will lead to error
        let tabBarExtraContent: TabBarExtraMap | undefined;
        if (tabBarPrefix || tabBarSuffix) {
            tabBarExtraContent = {};
            if (tabBarPrefix) tabBarExtraContent.left = tabBarPrefix;
            if (tabBarSuffix) tabBarExtraContent.right = tabBarSuffix;
        }

        return (
            <AntTabs
                className={`g-tabs ${className || ""} ${initialMaxVisibleTabCount ? "with-max-visible-tab-count" : ""}`}
                animated={animated === undefined ? type === "line" : animated}
                type={type}
                tabBarExtraContent={tabBarExtraContent}
                renderTabBar={renderTabBar || ((oldProps, DefaultTabBar) => <DefaultTabBar {...oldProps} ref={this.tabBarCallBackRef} />)}
                {...restProps}
            />
        );
    }
}
