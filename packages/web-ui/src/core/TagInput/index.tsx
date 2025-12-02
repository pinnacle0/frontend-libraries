import React from "react";
import {classNames} from "../../util/ClassNames";
import type {ControlledFormValue} from "../../internal/type";
import "./index.less";
import {ReactUtil} from "../../util/ReactUtil";

interface Props<T> extends ControlledFormValue<T[]> {
    parser: (rawString: string) => T[];
    renderTag?: (item: T) => string;
    className?: (item: T) => string;
    style?: React.CSSProperties;
    disabled?: boolean;
    placeholder?: React.ReactElement | string | number | null;
    autoFocus?: boolean;
}

const separators = [" ", ";", "|", "*", "Tab", "Enter"];

export const TagInput = ReactUtil.memo("TagInput", <T,>(props: Props<T>) => {
    const {value, renderTag = item => item as string, className, style, disabled, placeholder, autoFocus = true, onChange, parser} = props;
    const [inputText, setInputText] = React.useState("");

    const removeTag = (index: number) => {
        if (disabled) return;

        const newTags = [...value];
        newTags.splice(index, 1);
        onChange(newTags);
    };

    const addTagsByInput = (input: string) => {
        if (disabled) return;

        if (input) {
            setInputText("");
            onChange([...value, ...parser(input)]);
        }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Ref: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
        if (event.key === "Backspace" && !inputText.length) {
            removeTag(value.length - 1);
        } else if (separators.includes(event.key)) {
            event.preventDefault();
            addTagsByInput(inputText);
        }
    };

    const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(event.target.value);

    const onBlur = () => addTagsByInput(inputText);

    return (
        <div className={classNames("g-tag-input", {"ant-input-disabled": disabled})} style={style}>
            {value.map((tag, index) => {
                return (
                    <div className={classNames("g-tag-input-label", className?.(tag))} key={index}>
                        {renderTag(tag)}
                        <i onClick={() => removeTag(index)}>×</i>
                    </div>
                );
            })}
            {!value.length && !inputText && <div className="placeholder">{placeholder}</div>}
            {/* The absolute position of textarea for prevent the cursor jumps back to the beginning while typing in the textarea out of view */}
            <div className="text-area-wrapper">
                <textarea disabled={disabled} onBlur={onBlur} onChange={onInputChange} onKeyDown={onKeyDown} value={inputText} autoFocus={autoFocus} />
            </div>
        </div>
    );
});
