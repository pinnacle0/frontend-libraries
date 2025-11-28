import React from "react";
import {Tag} from "../Tag";
import type {TagColor} from "../Tag";

export interface Props {
    items: Array<React.ReactElement | string | number | null>;
    /**
     * If true, items are used as key. (Only accpet string or number)
     */
    useItemsAsKey?: boolean;
    /**
     * If undefined, tags are not closable.
     */
    onClose?: (index: number) => void;
    color?: TagColor | ((item: React.ReactElement | string | number | null, index: number) => TagColor);
    maxWidth?: number;
    extraContent?: React.ReactElement | string | number | null;
}

export class Tags extends React.PureComponent<Props> {
    static displayName = "Tags";

    private readonly singleTagStyle: React.CSSProperties = {marginRight: 5, marginBottom: 4};

    renderTag = (item: React.ReactElement | string | number | null, index: number) => {
        const {color, onClose, useItemsAsKey} = this.props;
        const tagColor = typeof color === "function" ? color(item, index) : color;
        const key = (typeof item === "string" || typeof item === "number") && useItemsAsKey ? item : null;
        return (
            <Tag color={tagColor} key={key || index} style={this.singleTagStyle} closable={onClose !== undefined} onClose={() => onClose?.(index)}>
                {item}
            </Tag>
        );
    };

    render() {
        const {items, maxWidth, extraContent} = this.props;
        return (
            <div style={{maxWidth}}>
                {items.map(this.renderTag)}
                {extraContent && extraContent}
            </div>
        );
    }
}
