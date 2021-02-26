import React from "react";
import "./index.less";

/**
 * Currently, <Markdown> supports:
 * - \n for new line, each line wrapped with <p/>.
 * - `text` for emphasis, transform to <em>text</em>.
 * - __text__ for boldness, transform to <b>text</b>.
 *
 * Nested usage not supported yet.
 */
export interface Props {
    children: string;
    style?: React.CSSProperties;
}

export class Markdown extends React.PureComponent<Props> {
    static displayName = "Markdown";

    renderBold = (content: string, index: number) => {
        const splitContents = content.split("__");
        return <React.Fragment key={index}>{splitContents.map((_, segmentIndex) => (segmentIndex % 2 === 1 ? <b key={"bold" + segmentIndex}>{_}</b> : _))}</React.Fragment>;
    };

    renderLine = (content: string, index: number) => {
        const splitContents = content.split("`");
        return <p key={index}>{splitContents.map((_, segmentIndex) => (segmentIndex % 2 === 1 ? <em key={segmentIndex}>{_}</em> : this.renderBold(_, segmentIndex)))}</p>;
    };

    render() {
        const {children, style} = this.props;
        return (
            <div className="g-markdown" style={style}>
                {children.split("\n").map(this.renderLine)}
            </div>
        );
    }
}
