import React from "react";
import notification, {ArgsProps as NotificationOptions} from "antd/lib/notification";
import "antd/lib/notification/style";

function create(options: NotificationOptions) {
    notification.open(options);
}

function destroy() {
    notification.destroy();
}

export const NotificationUtil = Object.freeze({
    create,
    destroy,
});
