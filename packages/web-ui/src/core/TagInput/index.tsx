import React from "react";
import type {ControlledFormValue, PickOptional, SafeReactChild} from "../../internal/type";
import "./index.less";

interface Props<T> extends ControlledFormValue<T[]> {
    parser: (rawString: string) => T[];
    renderTag?: (item: T) => string;
    className?: (item: T) => string;
    style?: React.CSSProperties;
    disabled?: boolean;
    placeholder?: SafeReactChild;
    autoFocus?: boolean;
}

interface State {
    inputText: string;
}

const separators = [",", " ", ";", "|", "*", "Tab", "Enter"];

export class TagInput<T> extends React.PureComponent<Props<T>, State> {
    static displayName = "TagInput";

    static defaultProps: PickOptional<Props<string>> = {
        renderTag: item => item,
    };

    constructor(props: Props<T>) {
        super(props);
        this.state = {inputText: ""};
    }

    removeTag = (index: number) => {
        const {onChange, value, disabled} = this.props;
        if (disabled) {
            return;
        }
        const newTags = [...value];
        newTags.splice(index, 1);
        onChange(newTags);
    };

    addTagsByInput = (input: string) => {
        if (this.props.disabled) {
            return;
        }
        if (input) {
            const {parser, onChange, value} = this.props;
            this.setState({inputText: ""});
            onChange([...value, ...parser(input)]);
        }
    };

    onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ref: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
        const {inputText} = this.state;

        if (event.key === "Backspace") {
            if (!inputText.length) {
                this.removeTag(this.props.value.length - 1);
            }
        } else if (separators.includes(event.key)) {
            event.preventDefault();
            this.addTagsByInput(inputText);
        }
    };

    onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({inputText: event.target.value});

    onBlur = () => this.addTagsByInput(this.state.inputText);

    render() {
        const {value, renderTag, className, style, disabled, placeholder, autoFocus = true} = this.props;
        const {inputText} = this.state;
        return (
            <div className={`g-tag-input ${disabled ? "ant-input-disabled" : ""}`} style={style}>
                {value.map((tag, index) => {
                    return (
                        <div className={`g-tag-input-label ${className ? className(tag) : ""}`} key={index}>
                            {renderTag!(tag)}
                            <i onClick={() => this.removeTag(index)}>&times;</i>
                        </div>
                    );
                })}
                {!value.length && !inputText && <div className="placeholder">{placeholder}</div>}
                <textarea disabled={disabled} onBlur={this.onBlur} onChange={this.onChange} onKeyDown={this.onKeyDown} value={inputText} autoFocus={autoFocus} />
            </div>
        );
    }
}
