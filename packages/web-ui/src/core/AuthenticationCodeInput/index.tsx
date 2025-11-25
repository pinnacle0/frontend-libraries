import React from "react";
import {Button} from "../Button";
import {classNames} from "../../util/ClassNames";
import {i18n} from "../../internal/i18n/core";
import {TextUtil} from "../../internal/TextUtil";
import {Input} from "../Input";
import type {Props as InputProps} from "../Input";
import {ReactUtil} from "../../util/ReactUtil";
import {useDidMountEffect} from "../../hooks/useDidMountEffect";
import {useWillUnmountEffect} from "../../hooks/useWillUnmountEffect";
import "./index.less";

export interface Props extends Omit<InputProps, "suffix"> {
    onSend: () => Promise<boolean>;
    nextSendInterval?: number; // In second
    autoSendOnMount?: boolean;
    sendButtonText?: string;
}

export const AuthenticationCodeInput = ReactUtil.memo("AuthenticationCodeInput", (props: Props) => {
    const {nextSendInterval = 60, autoSendOnMount, sendButtonText, className, onSend, ...inputProps} = props;
    const [isSending, setIsSending] = React.useState(false); // Only true during calling send API
    const [nextSendRemainingSecond, setNextSendRemainingSecond] = React.useState<number | null>(null); // At least 1 when type is number
    const timer = React.useRef<NodeJS.Timeout | null>(null);
    const t = i18n();

    useDidMountEffect(() => {
        if (autoSendOnMount) {
            handleSend();
        }
    });

    useWillUnmountEffect(() => {
        timer.current !== null && clearInterval(timer.current);
    });

    const updateNextSendRemainingSecond = () => {
        setNextSendRemainingSecond(prev => {
            if (prev === null) return null;
            const nextSecond = prev - 1;
            if (nextSecond <= 0) {
                timer.current && clearInterval(timer.current);
                timer.current = null;
                return null;
            }
            return nextSecond;
        });
    };

    const handleSend = async () => {
        try {
            setIsSending(true);
            const sendSuccess = await onSend();
            if (sendSuccess) {
                setNextSendRemainingSecond(nextSendInterval);
                timer.current = setInterval(updateNextSendRemainingSecond, 1000);
            }
        } finally {
            setIsSending(false);
        }
    };

    const sendButton = (
        <Button type="primary" ghost className="g-auth-code-input-send-button" size="small" disabled={inputProps.disabled || nextSendRemainingSecond !== null || isSending} onClick={handleSend}>
            {nextSendRemainingSecond ? TextUtil.interpolate(t.waitResendAuthCode, nextSendRemainingSecond.toString()) : sendButtonText || t.sendAuthCode}
        </Button>
    );
    return <Input {...inputProps} className={classNames(className, "g-auth-code-input")} suffix={sendButton} />;
});
