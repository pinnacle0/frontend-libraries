import React from "react";
import type {ArgsProps} from "antd/es/message";
import Message from "antd/es/message";
import type {MessageInstance} from "antd/es/message/interface";

let messageInstance: MessageInstance | null = null;

function success(content: string | React.ReactElement) {
    (messageInstance || Message).success(content);
}

function error(content: string | React.ReactElement) {
    (messageInstance || Message).error(content);
}

function info(config: Partial<Omit<ArgsProps, "type">> & {content: ArgsProps["content"]}) {
    (messageInstance || Message).open({duration: 3, ...config, type: "info"});
}

function Root(): React.ReactElement {
    const [apiInstance, contextHolder] = Message.useMessage();
    React.useEffect(
        () => {
            if (messageInstance) {
                throw new Error("[web-ui] Message.Root cannot be mounted more than once");
            }
            messageInstance = apiInstance;
            return () => {
                messageInstance = null;
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- for didMount/willUnmount lifecycle
        []
    );
    return contextHolder;
}

export const MessageUtil = Object.freeze({
    success,
    error,
    info,
    Root,
});
