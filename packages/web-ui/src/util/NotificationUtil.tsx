import React from "react";
import notification from "antd/es/notification";
import type {ArgsProps as NotificationOptions, NotificationInstance, NotificationConfig} from "antd/es/notification/interface";

export type {NotificationConfig};

let notificationInstance: NotificationInstance | null = null;

function create(options: NotificationOptions) {
    if (notificationInstance) {
        notificationInstance.open(options);
    } else {
        notification.open(options);
    }
}

function destroy(key?: React.Key) {
    notification.destroy(key);
}

function Root(config?: NotificationConfig): React.ReactElement {
    const [apiInstance, contextHolder] = notification.useNotification(config);
    React.useEffect(
        () => {
            if (notificationInstance) {
                throw new Error("[web-ui] NotificationUtil.Root cannot be mounted more than once");
            }
            notificationInstance = apiInstance;
            return () => {
                notificationInstance = null;
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps -- for didMount/willUnmount lifecycle
        []
    );
    return contextHolder;
}

export const NotificationUtil = Object.freeze({
    create,
    destroy,
    Root,
});
