import React from "react";
import type {ArgsProps as NotificationOptions, NotificationInstance} from "antd/lib/notification";
import notification from "antd/lib/notification";
import "antd/lib/notification/style";

let notificationInstance: NotificationInstance | null = null;

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

function Root(): React.ReactElement {
    const [apiInstance, contextHolder] = notification.useNotification();
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
