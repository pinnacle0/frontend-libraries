import React from "react";
import {DragController} from "./DragController";
import type {DragConfig} from "./type";

export const useDrag = (config: DragConfig) => {
    const controller = React.useMemo(() => new DragController(), []);

    React.useEffect(() => {
        controller.updateHandlers(config);
    }, [config, controller]);

    React.useEffect(() => {
        document.addEventListener("mousemove", controller.onDrag);
        document.addEventListener("mouseup", controller.onDragEnd);

        return () => {
            document.removeEventListener("mousemove", controller.onDrag);
            document.removeEventListener("mouseup", controller.onDragEnd);
        };
    }, [config, controller]);

    return {
        onMouseDown: controller.onDragStart.bind(controller),
    };
};
