import React from "react";
import {Tooltip} from "../Tooltip";
import {ReactUtil} from "../../util/ReactUtil";

export interface TooltipListProps {
    label: string;
    content: string | number | React.ReactElement;
}

export interface Props {
    list: Array<TooltipListProps | "-">;
    /**
     * If undefined, it will use the first list item as label.
     * If ReactElement, make sure it is inline-block, to make the tooltip arrow centered.
     */
    children?: string | React.ReactElement;
    onClick?: () => void;
    onOpenChange?: (open: boolean) => void;
}

const labelStyle: React.CSSProperties = {display: "inline-block", width: 90};
const wrapperStyle: React.CSSProperties = {display: "inline-block"};

export const WithTooltipList = ReactUtil.memo("WithTooltipList", ({list, children, onClick, onOpenChange}: Props) => {
    if (list.length === 0) return children || "-";

    let label: React.ReactNode;
    if (children) label = children;
    else if (list[0] === "-") label = "-";
    else if (typeof list[0].content === "string" || typeof list[0].content === "number") {
        label = list[0].label + ": " + list[0].content;
    } else {
        label = (
            <React.Fragment>
                {list[0].label}: {list[0].content}
            </React.Fragment>
        );
    }

    const tooltipTitle = (
        <div>
            {list.map((item, index) =>
                item === "-" ? (
                    <hr key={index} />
                ) : (
                    <p key={item.label}>
                        <span style={labelStyle}>{item.label}</span>
                        <em>{item.content}</em>
                    </p>
                )
            )}
        </div>
    );

    /**
     * - Must wrap with a <div> since the child node of <Tooltip> must accept certain methods, since <a>'s onClick is used already.
     * - Wrapper must be inline-block, to make the tooltip arrow centered.
     *
     * Ref: https://ant.design/components/tooltip/#Note
     */
    return (
        <Tooltip placement="bottom" title={tooltipTitle} onOpenChange={onOpenChange} childContainerProps={{style: wrapperStyle}}>
            <a onClick={onClick || (() => {})} style={wrapperStyle} className="g-with-tooltip-list-anchor">
                {label}
            </a>
        </Tooltip>
    );
});
