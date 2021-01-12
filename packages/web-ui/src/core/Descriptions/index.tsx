import React from "react";
import AntDescriptions from "antd/lib/descriptions";
import "antd/lib/descriptions/style";
import type {SafeReactChild, SafeReactChildren} from "../../internal/type";
import "./index.less";

export interface Props {
    children: SafeReactChildren;
    horizontal?: boolean;
    title?: string;
    column?: number; // If undefined, column length will be same as children's length
    className?: string;
    style?: React.CSSProperties;
}

export interface DescriptionsItemProps {
    label: SafeReactChild;
    children: SafeReactChildren;
    className?: string;
    style?: React.CSSProperties;
    span?: number;
}

export class Descriptions extends React.PureComponent<Props> {
    static displayName = "Descriptions";

    static Item = (props: DescriptionsItemProps) => <AntDescriptions.Item {...props} />;

    private readonly containerStyle: React.CSSProperties = {marginBottom: 15};

    render() {
        const {horizontal, column, title, children, className, style} = this.props;
        const columnCount = column || React.Children.count(children);
        return (
            <AntDescriptions style={{...this.containerStyle, ...style}} className={className} layout={horizontal ? "horizontal" : "vertical"} bordered title={title} column={columnCount}>
                {children}
            </AntDescriptions>
        );
    }
}
