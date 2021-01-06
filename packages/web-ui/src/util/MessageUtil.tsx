import React from "react";
import message, {ArgsProps} from "antd/lib/message";
import "antd/lib/message/style";

function success(content: string | React.ReactElement) {
    message.success(content);
}

function error(content: string | React.ReactElement) {
    message.error(content);
}

function info(config: Partial<Omit<ArgsProps, "type">> & {content: ArgsProps["content"]}) {
    message.open({duration: 3, ...config, type: "info"});
}

export const MessageUtil = Object.freeze({
    success,
    error,
    info,
});
