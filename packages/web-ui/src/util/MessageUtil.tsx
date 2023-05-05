import type React from "react";
import type {ArgsProps} from "antd/es/message";
import message from "antd/es/message";

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
