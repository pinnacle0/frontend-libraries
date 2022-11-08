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
type MarkdownSymbol = "**" | "__" | "`";

export interface Props {
    children: string;
    whitelist?: MarkdownSymbol[];
    style?: React.CSSProperties;
}

export class Markdown extends React.PureComponent<Props> {
    static displayName = "Markdown";

    renderBold = (content: string, index: number) => {
        const {whitelist} = this.props;
        const whiteListRegex = ["\\*\\*", "__"];

        const regexStr = (whitelist?.filter(x => x !== "`").map(this.whiteListRegexPart) || whiteListRegex).join("|");
        const splitContents = content.split(new RegExp(regexStr));
        return <React.Fragment key={index}>{splitContents.map((_, segmentIndex) => (segmentIndex % 2 === 1 ? <b key={"bold" + segmentIndex}>{_}</b> : _))}</React.Fragment>;
    };

    renderLine = (content: string, index: number) => {
        const {whitelist} = this.props;

        const splitContents = !whitelist || whitelist.includes("`") ? content.split("`") : [content];
        return (
            <div className="line" key={index}>
                {splitContents.map((_, segmentIndex) => (segmentIndex % 2 === 1 ? <em key={segmentIndex}>{_}</em> : this.renderBold(_, segmentIndex)))}
            </div>
        );
    };

    render() {
        const {children, style} = this.props;
        return (
            <div className="g-markdown" style={style}>
                {children.split("\n").map(this.renderLine)}
            </div>
        );
    }

    private whiteListRegexPart = (symbol: MarkdownSymbol): string => {
        if (symbol === "**") {
            return "\\*\\*";
        }

        return symbol;
    };
}
