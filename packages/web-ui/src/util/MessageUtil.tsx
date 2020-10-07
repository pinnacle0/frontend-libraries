import React from "react";
import message from "antd/lib/message";
import "antd/lib/message/style";

function success(content: string | React.ReactElement) {
    message.success(content);
}

function error(content: string | React.ReactElement) {
    message.error(content);
}

function info(content: string | React.ReactElement, icon: React.ReactElement) {
    message.info({content, icon});
}

export const MessageUtil = Object.freeze({
    success,
    error,
    info,
});
