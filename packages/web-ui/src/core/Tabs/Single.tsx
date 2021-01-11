import React from "react";
import {Tabs} from "./index";
import type {SafeReactChildren} from "../../internal/type";

interface Props {
    title: string;
    children: SafeReactChildren;
    postfix?: SafeReactChildren;
}

export class Single extends React.PureComponent<Props> {
    static displayName = "Single";

    render() {
        const {children, title, postfix} = this.props;
        return (
            <Tabs type="line" tabBarSuffix={postfix}>
                <Tabs.TabPane tab={title} key={title}>
                    {children}
                </Tabs.TabPane>
            </Tabs>
        );
    }
}
