import React from "react";
import {Input} from "../../core/Input";
import {Form} from "../../core/Form";
import {Markdown} from "../../core/Markdown";
import {PromptConfig, PromptResult} from "./index";
import "./index.less";

export interface Props extends PromptConfig {}

interface State {
    textValue: string;
}

export class PromptBody extends React.PureComponent<Props, State> {
    static displayName = "PromptBody";

    private readonly formRef: React.RefObject<Form>;
    private readonly warningStyle: React.CSSProperties = {marginTop: 8, color: "red"};
    private readonly formStyle: React.CSSProperties = {marginTop: 12};

    constructor(props: Props) {
        super(props);
        this.state = {textValue: props.initialInputValue || ""};
        this.formRef = React.createRef();
    }

    validateForm = async (): Promise<PromptResult> => {
        const validationPassed = this.formRef.current!.triggerSubmit();
        if (await validationPassed) {
            return {value: this.state.textValue};
        } else {
            return null;
        }
    };

    render() {
        const {body, warning, inputPlaceholder, inputType, inputValidator} = this.props;
        const {textValue} = this.state;
        return (
            <div className={`g-modal-prompt-body ${inputType === "multi-line" ? "multi-linw" : ""}`}>
                <Markdown>{body}</Markdown>
                <p style={this.warningStyle}>{warning}</p>
                <Form ref={this.formRef} style={this.formStyle}>
                    <Form.Item validator={() => inputValidator?.(textValue) || null}>
                        {inputType === "multi-line" ? (
                            <Input.TextArea placeholder={inputPlaceholder} value={textValue} onChange={textValue => this.setState({textValue})} />
                        ) : (
                            <Input
                                type={inputType === "password" ? "password" : "text"}
                                autoComplete="new-password"
                                placeholder={inputPlaceholder}
                                value={textValue}
                                onChange={textValue => this.setState({textValue})}
                            />
                        )}
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
