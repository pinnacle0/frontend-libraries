import React from "react";
import type {TagColor} from "./Tag";
import {Tag} from "./Tag";

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

    private readonly singleTagStyle: React.CSSProperties = {marginRight: 5, marginBottom: 4};

    renderTag = (item: React.ReactChild, index: number) => {
        const {color, onClose} = this.props;
        const tagColor = typeof color === "function" ? color(item, index) : color;
        // we need to pass the visible property explicitly to avoid unexpected behavior when the tag is close
        return (
            <Tag color={tagColor} key={index} style={this.singleTagStyle} closable={onClose !== undefined} onClose={() => onClose?.(index)} visible>
                {item}
            </Tag>
        );
    };

    render() {
        const {items, maxWidth} = this.props;
        return <div style={{maxWidth}}>{items.map(this.renderTag)}</div>;
    }
}
