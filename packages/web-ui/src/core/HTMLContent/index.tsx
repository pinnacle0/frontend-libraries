import React from "react";
import {classNames} from "../../util/ClassNames";
import "./index.less";

interface Props {
    html: string;
    className?: string;
}

export class HTMLContent extends React.PureComponent<Props> {
    static displayName = "HTMLContent";

    render() {
        const {html, className} = this.props;
        return <div className={classNames("g-html-content", className)} dangerouslySetInnerHTML={{__html: html}} />;
    }
}
