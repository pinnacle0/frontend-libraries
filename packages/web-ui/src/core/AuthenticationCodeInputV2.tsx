import React from "react";
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
    sendText?: string;
}

interface State {
    isSending: boolean; // Only true during calling send API
    nextSendRemainingSecond: number | null; // At least 1 when type is number
}

export class AuthenticationCodeInputV2 extends React.PureComponent<Props, State> {
    static displayName = "AuthenticationCodeInputV2";
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
            sendText,
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
        const disabled = inputProps.disabled || nextSendRemainingSecond !== null || isSending;
        const groupStyle: React.CSSProperties = {display: "flex", alignItems: "center"};
        const sendTextStyle: React.CSSProperties = {
            color: disabled ? "#b2c2cf" : "#3d9cf1",
            textDecoration: "underline",
            whiteSpace: "nowrap",
            fontSize: 12,
            cursor: disabled ? "not-allowed" : "pointer",
        };
        return (
            <div className="g-auth-code-input-group" style={groupStyle}>
                <Input {...inputProps} className={classNames(className, "g-auth-code-input")} />
                <div className="g-auth-code-input-send-text" style={sendTextStyle} onClick={!disabled ? this.onSend : undefined}>
                    {nextSendRemainingSecond ? TextUtil.interpolate(t.waitResendAuthCode, nextSendRemainingSecond.toString()) : sendText || t.sendAuthCode}
                </div>
            </div>
        );
    }
}
