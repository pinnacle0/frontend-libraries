import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style";

export interface Props {
    items: string[];
    /**
     * If undefined, tags are not closable.
     */
    onClose?: (index: number) => void;
    status?: "success" | "error" | "default";
    maxWidth?: number;
}

export class Tags extends React.PureComponent<Props> {
    static displayName = "Tags";

    private readonly tagStyle: React.CSSProperties = {marginRight: 5, marginBottom: 4};

    renderTag = (item: string, index: number) => {
        const {status, onClose} = this.props;
        const color = status === "success" ? "blue" : status === "error" ? "red" : undefined;
        return (
            <Tag color={color} key={index} style={this.tagStyle} closable={onClose !== undefined} onClose={() => onClose?.(index)}>
                {item}
            </Tag>
        );
    };

    render() {
        const {items, maxWidth} = this.props;
        return maxWidth ? <div style={{maxWidth}}>{items.map(this.renderTag)}</div> : items.map(this.renderTag);
    }
}
