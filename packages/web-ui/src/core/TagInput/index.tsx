import React from "react";
import {TagLabel} from "./TagLabel";

import "./index.less";

interface Props {
    tags: string[];
    onChangeTags: (tags: string[]) => void;
    parser: (text: string) => string[];
}

interface State {
    inputText: string;
}

export class TagInput extends React.PureComponent<Props, State> {
    static displayName = "TagInput";

    constructor(props: Props) {
        super(props);
        this.state = {inputText: ""};
    }

    removeBet = (index: number) => {
        const {onChangeTags, tags} = this.props;
        const newTags = [...tags];
        newTags.splice(index, 1);
        onChangeTags(newTags);
    };

    addBetsByInput = (input: string) => {
        if (input) {
            const {parser, onChangeTags, tags} = this.props;
            this.setState({inputText: ""});
            onChangeTags([...tags, ...parser(input)]);
            console.info(this.state.inputText);
        }
    };

    onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ref: https://css-tricks.com/snippets/javascript/javascript-keycodes/
        const {inputText} = this.state;
        if (event.keyCode === 8) {
            // Backspace
            if (!inputText.length) {
                this.removeBet(this.props.tags.length - 1);
            }
        } else if ([9, 13, 32, 188].includes(event.keyCode)) {
            // Tab: 9
            // Enter:13
            // Space, 32
            // Comma: 188
            this.addBetsByInput(inputText);
        }
    };

    onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({inputText: event.target.value});

    onBlur = () => this.addBetsByInput(this.state.inputText);

    render() {
        const {tags} = this.props;
        const {inputText} = this.state;
        return (
            <div className="g-tag-input">
                <TagLabel tags={tags} onRemove={this.removeBet} />
                <textarea onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown} value={inputText} autoFocus />
            </div>
        );
    }
}
