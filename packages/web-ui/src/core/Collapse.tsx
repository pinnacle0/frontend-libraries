import React from "react";
import AntdCollapse from "antd/es/collapse";
import type {CollapseProps, CollapsePanelProps} from "antd/es/collapse";
import "antd/es/collapse/style";

/** Will be remove in future, replaced by Foldable and Accordion */
export interface Props extends CollapseProps {}

export class Collapse extends React.PureComponent<Props> {
    static displayName = "Collapse";

    static Panel = AntdCollapse.Panel;

    render() {
        return <AntdCollapse {...this.props} />;
    }
}

export type PanelProps = CollapsePanelProps;
