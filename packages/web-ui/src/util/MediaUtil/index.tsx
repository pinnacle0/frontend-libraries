import React from "react";
import ReactDOM from "react-dom";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import "./index.less";

function open(url: string, type: "image" | "video") {
    return new Promise(resolve => {
        const bodyElement = document.body;
        const divElement = document.createElement("div");
        const closeModal = () => {
            bodyElement.removeChild(divElement);
            resolve();
        };

        ReactDOM.render(
            <div onClick={closeModal} className="g-media-modal">
                {type === "image" ? <img src={url} /> : <video src={url} autoPlay controls controlsList="nodownload" muted />}
                <CloseOutlined />
            </div>,
            divElement,
            () => bodyElement.appendChild(divElement)
        );
    });
}

export const MediaUtil = Object.freeze({
    open,
});
