import React from "react";
import {Controller} from "./controller";
import type {SwipeHookConfig, SwipeHookHandlers, SwipeHookResult} from "./type";

export const useSwipe = (handlers: SwipeHookHandlers, config?: SwipeHookConfig): SwipeHookResult => {
    const controller = React.useMemo(() => new Controller(), []);
    controller.update(handlers, config);
    return {
        ...controller.createHandlers.apply(controller),
        ref: controller.createRef(),
    };
};

export * from "./type";
