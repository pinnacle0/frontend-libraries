import React from "react";
import {Tabs, Props as TabsProps} from "./index";
import {SafeReactChildren} from "../../internal/type";

export interface Props extends Omit<TabsProps, "activeKey" | "onChange" | "defaultActiveKey"> {
    title: string;
    children: SafeReactChildren;
}

export class Single extends React.PureComponent<Props> {
    static displayName = "Single";

    render() {
        const {children, title, ...rest} = this.props;
        return (
            <Tabs type="line" {...rest}>
                <Tabs.TabPane tab={title} key={title}>
                    {children}
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
