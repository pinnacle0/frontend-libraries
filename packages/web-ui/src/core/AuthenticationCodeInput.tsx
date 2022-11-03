import React from "react";
import {Button} from "./Button";
import {classNames} from "../util/ClassNames";
import {i18n} from "../internal/i18n/core";
import {TextUtil} from "../internal/TextUtil";
import {Input} from "./Input";
import type {Props as InputProps} from "./Input";
import type {PickOptional} from "../internal/type";

export interface Props extends Omit<InputProps, "suffix"> {
    onSend: () => Promise<boolean>;
    nextSendInterval?: number; // In second
    autoSendOnMount?: boolean;
    sendButtonText?: string;
}

interface State {
    isSending: boolean; // Only true during calling send API
    nextSendRemainingSecond: number | null; // At least 1 when type is number
}

export class AuthenticationCodeInput extends React.PureComponent<Props, State> {
    static displayName = "AuthenticationCodeInput";
    static defaultProps: PickOptional<Props> = {
        nextSendInterval: 60,
    };

    private timer: number | undefined;

    constructor(props: Props) {
        super(props);
        this.state = {
            isSending: false,
            nextSendRemainingSecond: null,
        };
    }

    componentDidMount() {
        if (this.props.autoSendOnMount) {
            this.onSend();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateNextSendRemainingSecond = () => {
        const nextSendRemainingSecond = this.state.nextSendRemainingSecond! - 1;
        if (nextSendRemainingSecond <= 0) {
            clearInterval(this.timer);
            this.setState({nextSendRemainingSecond: null});
        } else {
            this.setState({nextSendRemainingSecond});
        }
    };

    onSend = async () => {
        const {nextSendInterval, onSend} = this.props;

        try {
            this.setState({isSending: true});
            const sendSuccess = await onSend();
            if (sendSuccess) {
                this.setState({nextSendRemainingSecond: nextSendInterval!}, () => {
                    this.timer = window.setInterval(this.updateNextSendRemainingSecond, 1000);
                });
            }
        } finally {
            this.setState({isSending: false});
        }
    };

    render() {
        const {
            sendButtonText,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in inputProps
            onSend,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in inputProps
            autoSendOnMount,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars -- not included in inputProps
            nextSendInterval,
            className,
            ...inputProps
        } = this.props;
        const {isSending, nextSendRemainingSecond} = this.state;
        const t = i18n();
        const sendButton = (
            <Button className="g-auth-code-input-send-button" size="small" disabled={nextSendRemainingSecond !== null || isSending} onClick={this.onSend}>
                {nextSendRemainingSecond ? TextUtil.interpolate(t.waitResendAuthCode, nextSendRemainingSecond.toString()) : sendButtonText || t.sendAuthCode}
            </Button>
        );
        return <Input {...inputProps} className={classNames(className, "g-auth-code-input")} suffix={sendButton} />;
    }
}
