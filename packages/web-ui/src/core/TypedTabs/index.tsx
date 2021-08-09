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
    swipeable?: boolean;
}

export class TypedTabs<T extends string> extends React.PureComponent<Props<T>> {
    static displayName = "TypedTabs";

    SWIPE_BOUNDARY: number = 100;
    SWIPE_INTERMEDIATE: number = 50;
    SWIPE_ANIMATION_DURATION: number = 150;

    state = {
        transitionEnabled: false,
        xDiff: 0,
        xUp: 0,
        xDown: 0,
        swipeableWidth: 0,
    };

    get tabList() {
        const {tabs} = this.props;
        return Array.isArray(tabs) ? tabs : Object.entries<TabData>(tabs).map(([key, item]) => ({key, ...item}));
    }

    get tabListKeys() {
        return this.tabList.map(({key}) => key);
    }

    get swipeStyles(): React.CSSProperties {
        const {activeKey, swipeable} = this.props;

        if (!swipeable) {
            return {};
        }

        const translateX = (() => {
            if (this.isFirstKey(activeKey)) {
                return this.state.xDiff < 0 ? 0 : this.state.xDiff;
            } else if (this.isLastKey(activeKey)) {
                return this.state.xDiff > 0 ? 0 : this.state.xDiff;
            } else {
                return this.state.xDiff;
            }
        })();

        return {
            transform: `translate3d(${-translateX}px, 0, 0)`,
            transition: this.state.transitionEnabled ? `all ${this.SWIPE_ANIMATION_DURATION}ms ease-in-out` : undefined,
        };
    }

    isActiveKey = (currentKey: string): boolean => {
        return this.props.activeKey === currentKey;
    };

    isFirstKey = (currentKey: string): boolean => {
        return this.tabListKeys.indexOf(currentKey) === 0;
    };

    isLastKey = (currentKey: string): boolean => {
        return this.tabListKeys.indexOf(currentKey) === this.tabListKeys.length - 1;
    };

    onSwipeLeft = () => {
        const {activeKey, onChange} = this.props;
        const currentIndex = this.tabListKeys.indexOf(activeKey);
        if (currentIndex - 1 >= 0) {
            this.setState({
                transitionEnabled: true,
                xDiff: -this.state.swipeableWidth,
            });
            setTimeout(() => {
                onChange(this.tabListKeys[currentIndex - 1] as T);
                this.setState({
                    transitionEnabled: false,
                    xDown: 0,
                    xUp: 0,
                    xDiff: +this.state.swipeableWidth,
                });
                setTimeout(() => {
                    this.setState({
                        transitionEnabled: true,
                        xDiff: 0,
                    });
                }, this.SWIPE_ANIMATION_DURATION);
            }, this.SWIPE_ANIMATION_DURATION);
        } else {
            this.setState({
                transitionEnabled: true,
                xDiff: 0,
            });
        }
    };

    onSwipeRight = () => {
        const {activeKey, onChange} = this.props;
        const currentIndex = this.tabListKeys.indexOf(activeKey);
        if (currentIndex + 1 < this.tabListKeys.length) {
            this.setState({
                transitionEnabled: true,
                xDiff: +this.state.swipeableWidth,
            });
            setTimeout(() => {
                onChange(this.tabListKeys[currentIndex + 1] as T);
                this.setState({
                    transitionEnabled: false,
                    xDown: 0,
                    xUp: 0,
                    xDiff: -this.state.swipeableWidth,
                });
                setTimeout(() => {
                    this.setState({
                        transitionEnabled: true,
                        xDiff: 0,
                    });
                }, this.SWIPE_ANIMATION_DURATION);
            }, this.SWIPE_ANIMATION_DURATION);
        } else {
            this.setState({
                transitionEnabled: true,
                xDown: 0,
                xDiff: 0,
            });
        }
    };

    handleTouchEnd = () => {
        const {xDiff} = this.state;

        if (Math.abs(xDiff) !== 0) {
            if (xDiff > this.SWIPE_INTERMEDIATE) {
                this.onSwipeRight();
            } else if (xDiff < -this.SWIPE_INTERMEDIATE) {
                this.onSwipeLeft();
            }
        }
    };

    handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!this.state.xDown) {
            return;
        }

        const xUp = e.touches[0].clientX;
        const xDiff = this.state.xDown - xUp;

        this.setState({
            xUp,
            xDiff,
        });
    };

    handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const {clientX} = e.touches[0];

        // prevent override other swipe events (eg. navigation)
        if (clientX > this.SWIPE_BOUNDARY && clientX < this.state.swipeableWidth - this.SWIPE_BOUNDARY) {
            this.setState({
                xDown: clientX,
                transitionEnabled: false,
            });
        }
    };

    getSwipeHandlers = (currentKey: string) => {
        return this.props.swipeable && this.isActiveKey(currentKey)
            ? {
                  onTouchStart: this.handleTouchStart,
                  onTouchMove: this.handleTouchMove,
                  onTouchEnd: this.handleTouchEnd,
              }
            : {};
    };

    swipeableRef = (node: HTMLDivElement | null) => {
        if (node) {
            this.setState({swipeableWidth: node.getBoundingClientRect().width});
        }
    };

    render() {
        const {tabs, children, onChange, swipeable, ...restProps} = this.props;

        return (
            <Tabs onChange={onChange as (_: string) => void} {...restProps}>
                {this.tabList
                    .filter(_ => _.display !== "hidden")
                    .map(_ => (
                        <Tabs.TabPane tab={_.title} key={_.key}>
                            <div {...this.getSwipeHandlers(_.key)} ref={this.swipeableRef} className="swipeable-container" style={{height: "100%", ...this.swipeStyles}}>
                                {_.content}
                            </div>
                        </Tabs.TabPane>
                    ))}
            </Tabs>
        );
    }
}
