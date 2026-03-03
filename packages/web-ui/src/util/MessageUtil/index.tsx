import React from "react";
import ReactDOM from "react-dom/client";

interface MessageConfig {
    content: React.ReactNode;
    duration?: number;
    type?: "success" | "error" | "info" | "warning";
    key?: string | number;
    onClose?: () => void;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const typeColors: Record<string, string> = {
    success: "#52c41a",
    error: "#ff4d4f",
    info: "#1677ff",
    warning: "#faad14",
};

const typeIcons: Record<string, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
};

let messageContainer: HTMLDivElement | null = null;
let messageRoot: ReturnType<typeof ReactDOM.createRoot> | null = null;
let messages: Array<{id: number; config: MessageConfig}> = [];
let idCounter = 0;

function getContainer() {
    if (!messageContainer) {
        messageContainer = document.createElement("div");
        messageContainer.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:1010;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;";
        document.body.appendChild(messageContainer);
        messageRoot = ReactDOM.createRoot(messageContainer);
    }
    return messageRoot!;
}

function renderMessages() {
    const root = getContainer();
    root.render(
        <React.Fragment>
            {messages.map(({id, config}) => (
                <div
                    key={id}
                    style={{
                        padding: "9px 12px",
                        background: "#fff",
                        borderRadius: 8,
                        boxShadow: "0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 14,
                        pointerEvents: "auto",
                        ...config.style,
                    }}
                    className={config.className}
                >
                    {config.icon || <span style={{color: typeColors[config.type || "info"], fontWeight: 700}}>{typeIcons[config.type || "info"]}</span>}
                    <span>{config.content}</span>
                </div>
            ))}
        </React.Fragment>
    );
}

function showMessage(config: MessageConfig) {
    const id = ++idCounter;
    const duration = config.duration ?? 3;
    messages = [...messages, {id, config}];
    renderMessages();

    if (duration > 0) {
        setTimeout(() => {
            messages = messages.filter(m => m.id !== id);
            renderMessages();
            config.onClose?.();
        }, duration * 1000);
    }
}

function success(content: string | React.ReactElement) {
    showMessage({content, type: "success"});
}

function error(content: string | React.ReactElement) {
    showMessage({content, type: "error"});
}

function info(config: Partial<Omit<MessageConfig, "type">> & {content: MessageConfig["content"]}) {
    showMessage({duration: 3, ...config, type: "info"});
}

function Root(): React.ReactElement {
    return <React.Fragment />;
}

export const MessageUtil = Object.freeze({
    success,
    error,
    info,
    Root,
});
