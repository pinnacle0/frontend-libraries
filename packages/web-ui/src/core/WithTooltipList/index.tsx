import React from "react";
import {Tooltip} from "../Tooltip";

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

export class WithTooltipList extends React.PureComponent<Props> {
    static displayName = "WithTooltipList";

    private readonly labelStyle: React.CSSProperties = {display: "inline-block", width: 90};
    private readonly wrapperStyle: React.CSSProperties = {display: "inline-block"};
    private readonly childContainerProps: React.HTMLAttributes<HTMLDivElement> = {style: this.wrapperStyle};

    renderTooltip = () => {
        const {list} = this.props;

        return (
            <div>
                {list.map((item, index) =>
                    item === "-" ? (
                        <hr key={index} />
                    ) : (
                        <p key={item.label}>
                            <span style={this.labelStyle}>{item.label}</span>
                            <em>{item.content}</em>
                        </p>
                    )
                )}
            </div>
        );
    };

    render() {
        const {list, children, onClick, onOpenChange} = this.props;
        if (list.length === 0) {
            return children || "-";
        }

        const label = children ? (
            children
        ) : list[0] === "-" ? (
            "-"
        ) : typeof list[0].content === "string" || typeof list[0].content === "number" ? (
            list[0].label + ": " + list[0].content
        ) : (
            <React.Fragment>
                {list[0].label}: {list[0].content}
            </React.Fragment>
        );

        /**
         * - Must wrap with a <div> since the child node of <Tooltip> must accept certain methods, since <a>'s onClick is used already.
         * - Wrapper must be inline-block, to make the tooltip arrow centered.
         *
         * Ref: https://ant.design/components/tooltip/#Note
         */
        return (
            <Tooltip placement="bottom" title={this.renderTooltip()} onOpenChange={onOpenChange} childContainerProps={this.childContainerProps}>
                <a onClick={onClick || this.dummyClick} style={this.wrapperStyle} className="g-with-tooltip-list-anchor">
                    {label}
                </a>
            </Tooltip>
        );
    }

    private readonly dummyClick = () => {};
}
