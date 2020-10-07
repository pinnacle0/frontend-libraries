import React from "react";
import {Tooltip} from "./Tooltip";
import {Link} from "./Link";

export interface TooltipListProps {
    label: string;
    content: string | number | React.ReactElement;
}

export interface Props {
    list: Array<TooltipListProps | "-">;
    label?: string | React.ReactElement; // If undefined, it will use the first list item as label
    onClick?: () => void;
    onVisibleChange?: (visible: boolean) => void;
}

export class TextWithTooltipList extends React.PureComponent<Props> {
    static displayName = "TextWithTooltipList";

    private readonly dummyClick = () => {};
    private readonly labelStyle: React.CSSProperties = {display: "inline-block", width: 90};

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
        const {list, label: propLabel, onClick, onVisibleChange} = this.props;
        if (list.length === 0) {
            return propLabel || "-";
        }

        const label = propLabel ? (
            propLabel
        ) : list[0] === "-" ? (
            "-"
        ) : (
            <React.Fragment>
                {list[0].label}: {list[0].content}
            </React.Fragment>
        );

        return (
            <Tooltip placement="bottom" title={this.renderTooltip()} onVisibleChange={onVisibleChange}>
                <Link to={onClick || this.dummyClick}>{label}</Link>
            </Tooltip>
        );
    }
}
