import React from "react";
import {SafeReactChild, SafeReactChildren} from "../../internal/type";
import {i18n} from "../../internal/i18n/core";
import "./index.less";

export interface Props {
    title: SafeReactChild;
    children: SafeReactChildren;
    titleRight?: SafeReactChild;
    initialFolded?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

interface State {
    folded: boolean;
}

export class FoldableContainer extends React.PureComponent<Props, State> {
    static displayName = "FoldableContainer";

    constructor(props: Props) {
        super(props);
        this.state = {folded: props.initialFolded ?? false};
    }

    expand = () => this.setState({folded: false});

    fold = () => this.setState({folded: true});

    render() {
        const {title, children, titleRight, className, style} = this.props;
        const {folded} = this.state;
        const t = i18n();
        return (
            <div className={`g-foldable-container ${className || ""}`} style={style}>
                <div className={`header ${folded ? "folded" : ""}`}>
                    {title}
                    <div className="right">
                        <div className="custom">{titleRight}</div>
                        {folded ? (
                            <a className="folded" onClick={this.expand}>
                                {t.expand}
                            </a>
                        ) : (
                            <a onClick={this.fold}>{t.fold}</a>
                        )}
                    </div>
                </div>
                <div className={`content ${folded ? "folded" : ""}`}>{children}</div>
            </div>
        );
    }
}
