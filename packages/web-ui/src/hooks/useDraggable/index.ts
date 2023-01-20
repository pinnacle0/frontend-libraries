import React from "react";
import {NumberUtil} from "../../internal/NumberUtil";
import {useDrag} from "./useDrag";
import type {DragState, Vector} from "./type";
import {useTransform} from "../useTransform";

interface Config {
    target: React.RefObject<HTMLElement>;
    disabled?: boolean;
    gap?: number;
    onDragStart?: (state: DragState) => void;
    onDrag?: (state: DragState) => void;
    onDragEnd?: (state: DragState) => void;
}

export const useDraggable = ({target, disabled, onDragStart, onDrag, onDragEnd, gap = 0}: Config) => {
    const start = React.useRef([0, 0]);
    const bounds = React.useRef({x: [0, 0], y: [0, 0]});
    const transit = useTransform(target);

    const boundedDelta = (delta: Vector): Vector => {
        const [deltaX, deltaY] = delta;
        const [minX, maxX] = bounds.current.x;
        const [minY, maxY] = bounds.current.y;

        return [NumberUtil.clamp(deltaX, minX, maxX), NumberUtil.clamp(deltaY, minY, maxY)];
    };

    const bind = useDrag({
        onDragStart: state => {
            if (target.current) {
                // right & bottom from getBoundingClientRect() is not the same as css's right & bottom
                // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
                const {left, right, bottom, top} = target.current.getBoundingClientRect();
                start.current = [left, top];
                const minX = Math.min(0, -(left - gap));
                const maxX = Math.max(0, window.innerWidth - right - gap);
                const minY = Math.min(0, -(top - gap));
                const maxY = Math.max(0, window.innerHeight - bottom - gap);
                bounds.current = {x: [minX, maxX], y: [minY, maxY]};
                target.current.style.willChange = "transform";
                onDragStart?.(state);
            }
        },
        onDrag: state => {
            if (target.current) {
                const delta = boundedDelta(state.delta);
                !disabled && transit.to({x: delta[0], y: delta[1]});
                onDrag?.({...state, delta});
            }
        },
        onDragEnd: state => {
            if (target.current) {
                const delta = boundedDelta(state.delta);
                if (!disabled) {
                    target.current.style.left = `${start.current[0] + delta[0]}px`;
                    target.current.style.top = `${start.current[1] + delta[1]}px`;
                    transit.to({x: 0, y: 0, immediate: true});
                }
                onDragEnd?.({...state, delta});
            }
        },
    });

    return bind;
};
