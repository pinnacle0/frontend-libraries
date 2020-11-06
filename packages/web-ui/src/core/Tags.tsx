import React from "react";
import Tag from "antd/lib/tag";
import "antd/lib/tag/style";
import {PresetColorType, PresetStatusColorType} from "antd/lib/_util/colors";

type TagColor = PresetColorType | PresetStatusColorType;

export interface Props {
    items: React.ReactChild[];
    /**
     * If undefined, tags are not closable.
     */
    onClose?: (index: number) => void;
    color?: TagColor | ((item: React.ReactChild, index: number) => TagColor);
    maxWidth?: number;
}

export class Tags extends React.PureComponent<Props> {
    static displayName = "Tags";

    private readonly tagStyle: React.CSSProperties = {marginRight: 5, marginBottom: 4};

    renderTag = (item: React.ReactChild, index: number) => {
        const {color, onClose} = this.props;
        const tagColor = typeof color === "function" ? color(item, index) : color;
        return (
            <Tag color={tagColor} key={index} style={this.tagStyle} closable={onClose !== undefined} onClose={() => onClose?.(index)}>
                {item}
            </Tag>
        );
    };

    render() {
        const {items, maxWidth} = this.props;
        return <div style={{maxWidth}}>{items.map(this.renderTag)}</div>;
    }
}
