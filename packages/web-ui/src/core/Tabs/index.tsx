import React from "react";
import type {TabsProps, TabsType} from "antd/lib/tabs";
import AntTabs from "antd/lib/tabs";
import "antd/lib/tabs/style";
// eslint-disable-next-line import/no-duplicates -- false positive
import type RcTabNavList from "rc-tabs/lib/TabNavList";
// eslint-disable-next-line import/no-duplicates -- false positive
import type {TabNavListProps as RcTabNavListProps} from "rc-tabs/lib/TabNavList";
import {BrowserUtil} from "../../util/BrowserUtil";
import type {PickOptional, SafeReactChildren} from "../../internal/type";
import {Button} from "../Button";
import {Single} from "./Single";
import "./index.less";

export interface Props extends Omit<TabsProps, "type" | "tabBarExtraContent" | "renderTabBar"> {
    type?: TabsType | "button";
    tabBarPrefix?: SafeReactChildren;
    tabBarSuffix?: SafeReactChildren;
    renderTabBar?: (props: Omit<RcTabNavListProps, "ref" | "extra" | "onTabScroll">, DefaultTabBar: typeof RcTabNavList) => React.ReactElement;
}

interface State {
    showArrows?: boolean;
}

export class Tabs extends React.PureComponent<Props, State> {
    static displayName = "Tabs";

    static Single = Single;

    static TabPane = AntTabs.TabPane;

    static defaultProps: PickOptional<Props> = {
        type: "card",
    };

    private tabBarRef: HTMLDivElement | null = null; // Parent
    private tabNavList: HTMLDivElement | null = null; // Actual draggable element
    private tabBarExtraContentLeft: HTMLDivElement | null = null;
    private tabBarExtraContentRight: HTMLDivElement | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {showArrows: false};
        this.onTabBarDrag = this.onTabBarDrag.bind(this);
    }

    componentDidMount() {
        addEventListener("resize", this.handleUpdateShowArrows);
    }

    componentDidUpdate() {
        this.handleUpdateShowArrows();
    }

    componentWillUnmount() {
        removeEventListener("resize", this.handleUpdateShowArrows);
    }

    isTabBarOverflow = () =>
        this.tabNavList &&
        this.tabBarRef &&
        this.tabBarExtraContentLeft &&
        this.tabBarExtraContentRight &&
        this.tabNavList.clientWidth > this.tabBarRef.clientWidth - this.tabBarExtraContentLeft.clientWidth - this.tabBarExtraContentRight.clientWidth;

    handleUpdateShowArrows = () => {
        if (this.isTabBarOverflow()) {
            !this.state.showArrows && this.setState({showArrows: true});
        } else {
            this.state.showArrows && this.setState({showArrows: false});
        }
    };

    /**
     * Using callBackRef such that it is immediately invoked after all dom elements are rendered.
     * @param tabBar
     */
    tabBarCallBackRef = (tabBar: HTMLDivElement | null) => {
        if (tabBar && BrowserUtil.isMobile()) {
            const navList = tabBar.getElementsByClassName("ant-tabs-nav-list")[0];
            this.tabBarRef = tabBar;
            this.tabNavList = navList as HTMLDivElement;
            this.handleUpdateShowArrows();
        }
    };

    getExtra = () => ({
        left: (
            <div className="tab-bar-extra-content-wrap" onClick={this.onLeftArrowClick} ref={ref => (this.tabBarExtraContentLeft = ref)}>
                {this.props.tabBarPrefix}
                {this.state.showArrows && <button className="arrow">{"<"}</button>}
            </div>
        ),
        right: (
            <div className="tab-bar-extra-content-wrap" onClick={this.onRightArrowClick} ref={ref => (this.tabBarExtraContentRight = ref)}>
                {this.state.showArrows && <button className="arrow">{">"}</button>}
                {this.props.tabBarSuffix}
            </div>
        ),
    });

    /**
     * @param offset to go left, provide negative number, positive otherwise.
     */
    scroll = (offset: number) => {
        if (this.tabNavList) {
            if (this.isTabBarOverflow()) {
                const currentOffset = parseFloat(this.tabNavList.style?.transform?.replace(/.*translate\w?\(/i, "") as string) || 0; // Try parse current translate offset
                const minTransform = this.tabNavList.clientWidth - (this.tabBarRef!.clientWidth - this.tabBarExtraContentLeft!.clientWidth - this.tabBarExtraContentRight!.clientWidth); // Difference between the actual tabBar width and the needed tabBar width
                // 0 >= actualTransform >= minTransform
                const newTransform = Math.max(Math.min(currentOffset + offset, 0), -minTransform);
                this.tabNavList.style.transform = `translate(${newTransform}px)`;
            } else {
                this.tabNavList.style.transform = "";
            }
        }
    };

    onLeftArrowClick = () => this.scroll(40);

    onRightArrowClick = () => this.scroll(-40);

    // TODO: Add debounce
    onTabBarDrag(offset: number) {
        requestAnimationFrame(() => this.scroll(0));
    }

    renderButtonTabBar = (oldProps: any) => {
        const {onChange, activeKey} = this.props;
        /**
         * OldProps: {
         *  panes: []{
         *    key: TabKey,
         *    props: {
         *      tab: TabTitle
         *    }
         *  }
         * }
         */
        return (
            <div className="button-tab-bar">
                {oldProps.panes.map((_: any) => (
                    <Button size="large" onClick={() => onChange?.(_.key)} color={activeKey === _.key ? "primary" : "wire-frame"} key={_.key}>
                        {_.props.tab}
                    </Button>
                ))}
            </div>
        );
    };

    render() {
        const {tabBarPrefix, tabBarSuffix, renderTabBar, className, type, ...rest} = this.props;
        const extra = this.getExtra();

        return (
            <AntTabs
                className={`g-tabs ${className || ""}`}
                type={type !== "button" ? type : undefined}
                tabBarExtraContent={extra}
                renderTabBar={(oldProps, DefaultTabBar) =>
                    type === "button" ? (
                        this.renderButtonTabBar(oldProps)
                    ) : renderTabBar ? (
                        renderTabBar({...oldProps, extra, ref: this.tabBarCallBackRef, onTabScroll: this.onTabBarDrag}, DefaultTabBar as unknown as typeof RcTabNavList)
                    ) : (
                        <DefaultTabBar {...oldProps} ref={this.tabBarCallBackRef} onTabScroll={this.onTabBarDrag} />
                    )
                }
                {...rest}
            />
        );
    }
}
