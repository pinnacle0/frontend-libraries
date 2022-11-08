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

    processLine = (content: string, index: number, symbols: MarkdownSymbol[]): React.ReactNode[] => {
        switch (symbols[0]) {
            case "**":
                return this.renderBold(content.split(/\*\*/g), symbols);
            case "__":
                return this.renderBold(content.split(/__/g), symbols);
            case "`":
                return this.renderEmphasis(content.split(/`/g), symbols);
            default:
                return [<React.Fragment key={index}>{content}</React.Fragment>];
        }
    };

    render() {
        const {children, style, whitelist} = this.props;
        const symbols = whitelist || ["**", "__", "`"];

        return (
            <div className="g-markdown" style={style}>
                {children.split("\n").map((line, index) => (
                    <div className="line" key={index}>
                        {this.processLine(line, index, symbols)}
                    </div>
                ))}
            </div>
        );
    }

    private renderBold(splitContents: string[], symbols: MarkdownSymbol[]) {
        return splitContents.map((_, segmentIndex) => {
            const text = this.processLine(_, segmentIndex, symbols.slice(1));
            return segmentIndex % 2 === 1 ? <b key={`bold${segmentIndex}`}>{text}</b> : text;
        });
    }

    private renderEmphasis(splitContents: string[], symbols: MarkdownSymbol[]) {
        return splitContents.map((_, segmentIndex) => {
            const text = this.processLine(_, segmentIndex, symbols.slice(1));
            return segmentIndex % 2 === 1 ? <em key={`emphasis${segmentIndex}`}>{text}</em> : text;
        });
    }
}
