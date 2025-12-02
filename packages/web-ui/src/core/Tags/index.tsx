import React from "react";
import {Tag} from "../Tag";
import type {TagColor} from "../Tag";
import {ReactUtil} from "../../util/ReactUtil";

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

const singleTagStyle: React.CSSProperties = {marginRight: 5, marginBottom: 4};

export const Tags = ReactUtil.memo("Tags", ({items, maxWidth, extraContent, color, onClose, useItemsAsKey}: Props) => {
    const renderTag = (item: React.ReactElement | string | number | null, index: number) => {
        const tagColor = typeof color === "function" ? color(item, index) : color;
        const key = (typeof item === "string" || typeof item === "number") && useItemsAsKey ? item : null;
        return (
            <Tag color={tagColor} key={key || index} style={singleTagStyle} closable={onClose !== undefined} onClose={() => onClose?.(index)}>
                {item}
            </Tag>
        );
    };

    return (
        <div style={{maxWidth}}>
            {items.map(renderTag)}
            {extraContent && extraContent}
        </div>
    );
});
