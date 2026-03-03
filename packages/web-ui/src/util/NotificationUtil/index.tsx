import React from "react";
import ReactDOM from "react-dom/client";

export interface NotificationConfig {
    placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "top" | "bottom";
    top?: number;
    bottom?: number;
    duration?: number;
    maxCount?: number;
    className?: string;
    style?: React.CSSProperties;
}

interface NotificationOptions {
    key?: React.Key;
    message: React.ReactNode;
    description?: React.ReactNode;
    duration?: number | null;
    placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "top" | "bottom";
    className?: string;
    style?: React.CSSProperties;
    icon?: React.ReactNode;
    btn?: React.ReactNode;
    onClose?: () => void;
    onClick?: () => void;
    closeIcon?: React.ReactNode;
    type?: "success" | "info" | "warning" | "error";
}

let notificationContainer: HTMLDivElement | null = null;
let notificationRoot: ReturnType<typeof ReactDOM.createRoot> | null = null;
let notifications: Array<{id: number; options: NotificationOptions}> = [];
let idCounter = 0;

function getContainer() {
    if (!notificationContainer) {
        notificationContainer = document.createElement("div");
        notificationContainer.style.cssText = "position:fixed;top:24px;right:24px;z-index:1010;display:flex;flex-direction:column;gap:16px;max-width:384px;";
        document.body.appendChild(notificationContainer);
        notificationRoot = ReactDOM.createRoot(notificationContainer);
    }
    return notificationRoot!;
}

function renderNotifications() {
    const root = getContainer();
    root.render(
        <React.Fragment>
            {notifications.map(({id, options}) => (
                <div
                    key={id}
                    onClick={options.onClick}
                    style={{
                        padding: 16,
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
                        width: 384,
                        ...options.style,
                    }}
                    className={options.className}
                >
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                        <div style={{display: "flex", gap: 12, flex: 1}}>
                            {options.icon && <span>{options.icon}</span>}
                            <div>
                                <div style={{fontWeight: 600, fontSize: 16, marginBottom: 4}}>{options.message}</div>
                                {options.description && <div style={{fontSize: 14, color: "rgba(0,0,0,0.65)"}}>{options.description}</div>}
                            </div>
                        </div>
                        <span
                            onClick={e => {
                                e.stopPropagation();
                                removeNotification(id);
                                options.onClose?.();
                            }}
                            style={{cursor: "pointer", fontSize: 14, color: "rgba(0,0,0,0.45)", marginLeft: 12}}
                        >
                            {options.closeIcon || "✕"}
                        </span>
                    </div>
                    {options.btn && <div style={{marginTop: 12, textAlign: "right"}}>{options.btn}</div>}
                </div>
            ))}
        </React.Fragment>
    );
}

function removeNotification(id: number) {
    notifications = notifications.filter(n => n.id !== id);
    renderNotifications();
}

function create(options: NotificationOptions) {
    const id = ++idCounter;
    const duration = options.duration ?? 4.5;
    notifications = [...notifications, {id, options}];
    renderNotifications();

    if (duration && duration > 0) {
        setTimeout(() => {
            removeNotification(id);
            options.onClose?.();
        }, duration * 1000);
    }
}

function destroy(key?: React.Key) {
    if (key !== undefined) {
        notifications = notifications.filter(n => n.options.key !== key);
    } else {
        notifications = [];
    }
    renderNotifications();
}

function Root(_config?: NotificationConfig): React.ReactElement {
    return <React.Fragment />;
}

export const NotificationUtil = Object.freeze({
    create,
    destroy,
    Root,
});
