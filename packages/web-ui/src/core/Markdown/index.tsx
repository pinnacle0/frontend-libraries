import React from "react";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

/**
 * Currently, <Markdown> supports:
 * - \n for new line, each line wrapped with <div class="line">
 * - `text` for emphasis, transform to <em>
 * - __text__ or **text** for boldness, transform to <b>
 *
 * Nested usage not supported yet.
 */
type MarkdownSymbol = "**" | "__" | "`";

export interface Props {
    children: string;
    whitelist?: MarkdownSymbol[];
    style?: React.CSSProperties;
}

export const Markdown = ReactUtil.memo("Markdown", ({children, whitelist, style}: Props) => {
    const symbols = whitelist || ["**", "__", "`"];

    const renderBold = (splitContents: string[], symbols: MarkdownSymbol[]) => {
        return splitContents.map((_, segmentIndex) => {
            const text = processLine(_, segmentIndex, symbols.slice(1));
            return segmentIndex % 2 === 1 ? <b key={`bold${segmentIndex}`}>{text}</b> : text;
        });
    };

    const renderEmphasis = (splitContents: string[], symbols: MarkdownSymbol[]) => {
        return splitContents.map((_, segmentIndex) => {
            const text = processLine(_, segmentIndex, symbols.slice(1));
            return segmentIndex % 2 === 1 ? <em key={`emphasis${segmentIndex}`}>{text}</em> : text;
        });
    };

    const processLine = (content: string, _: number, symbols: MarkdownSymbol[]): React.ReactNode => {
        switch (symbols[0]) {
            case "**":
                return renderBold(content.split(/\*\*/g), symbols);
            case "__":
                return renderBold(content.split(/__/g), symbols);
            case "`":
                return renderEmphasis(content.split(/`/g), symbols);
            default:
                return content;
        }
    };

    return (
        <div className="g-markdown" style={style}>
            {children.split("\n").map((line, index) => (
                <div className="line" key={index}>
                    {processLine(line, index, symbols)}
                </div>
            ))}
        </div>
    );
});
