import React from "react";
import notification, {ArgsProps as NotificationOptions, NotificationInstance} from "antd/lib/notification";
import "antd/lib/notification/style";

let notificationInstance: NotificationInstance | null = null;

function useNotification(): React.ReactElement {
    const [apiInstance, contextHolder] = notification.useNotification();
    notificationInstance = apiInstance;
    return contextHolder;
}

function create(options: NotificationOptions) {
    if (notificationInstance) {
        notificationInstance.open(options);
    } else {
        notification.open(options);
    }
}

function destroy() {
    notification.destroy();
}

export const NotificationUtil = Object.freeze({
    create,
    destroy,
    useNotification,
});
