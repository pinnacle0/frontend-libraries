import React from "react";
import ReactDOM from "react-dom";
import CloseOutlined from "@ant-design/icons/CloseOutlined";
import "./index.less";

function openImage(url: string) {
    return new Promise<void>(resolve => {
        const bodyElement = document.body;
        const divElement = document.createElement("div");
        const closeModal = () => {
            bodyElement.removeChild(divElement);
            resolve();
        };

        ReactDOM.render(
            <div onClick={closeModal} className="g-media-modal">
                <img src={url} />
                <CloseOutlined />
            </div>,
            divElement,
            () => bodyElement.appendChild(divElement)
        );
    });
}

function openVideo(url: string) {
    return new Promise<void>(resolve => {
        const bodyElement = document.body;
        const divElement = document.createElement("div");
        const closeModal = () => {
            bodyElement.removeChild(divElement);
            resolve();
        };

        ReactDOM.render(
            <div onClick={closeModal} className="g-media-modal">
                <video src={url} autoPlay controls controlsList="nodownload" muted />
                <CloseOutlined />
            </div>,
            divElement,
            () => bodyElement.appendChild(divElement)
        );
    });
}

function playAudio(src: string, amplitude: number = 1) {
    try {
        // eslint-disable-next-line import/no-dynamic-require -- special use case
        const elementSource = new Audio(require(src));
        elementSource.crossOrigin = "anonymous";
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaElementSource(elementSource);
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = amplitude;
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        elementSource.play().catch(() => {});
    } catch (e) {
        // Do nothing
    }
}

export const MediaUtil = Object.freeze({
    openImage,
    openVideo,
    playAudio,
});
