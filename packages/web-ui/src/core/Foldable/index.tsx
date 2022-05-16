import React from "react";
import {classNames} from "../../util/ClassNames";
import type {SafeReactChild, SafeReactChildren} from "../../internal/type";
import "./index.less";

export interface Props {
    title: SafeReactChild;
    children: SafeReactChildren;
    expanded: boolean;
    onExpansionChange: (expanded: boolean) => void;
    titleRight?: SafeReactChild;
    className?: string;
    style?: React.CSSProperties;
}

export class Foldable extends React.PureComponent<Props> {
    static displayName = "Foldable";

    expand = () => this.props.onExpansionChange(true);

    fold = () => this.props.onExpansionChange(false);

    render() {
        const {title, children, titleRight, className, style, expanded} = this.props;
        return (
            <div className={classNames("g-foldable-container", className)} style={style}>
                <div className={classNames("header", expanded ? "expanded" : "folded")}>
                    {title}
                    <div className="right">
                        <div className="custom">{titleRight}</div>
                        {expanded ? <a className="expanded" onClick={this.fold} /> : <a className="folded" onClick={this.expand} />}
                    </div>
                </div>
                <div className={classNames("content", expanded ? "expanded" : "folded")}>{children}</div>
            </div>
        );
    }
}
