import type React from "react";

export type TouchHandler = Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onTouchStart" | "onTouchMove" | "onTouchEndCapture" | "onTouchCancelCapture">;

export interface TouchEventHandlers {
    onTouchMove: React.TouchEventHandler;
    onTouchStart: React.TouchEventHandler;
    onTouchEnd: React.TouchEventHandler;
    onTouchCancel: React.TouchEventHandler;
}

export interface SwipeHookResult extends TouchEventHandlers {
    ref: React.RefCallback<HTMLElement>;
}

export interface SwipeState {
    syntheticEvent: React.TouchEvent;
    startTouch: React.Touch;
    clientX: number;
    clientY: number;
    displacement: number;
    delta: Vector2;
    velocity: Vector2;
    elpased: number;
    direction: Direction;
    cancel: () => void;
}

type SwipeHookHandler = (event: SwipeState) => void;

export interface SwipeHookHandlers {
    onStart?: SwipeHookHandler;
    onEnd?: SwipeHookHandler;
    onMove?: SwipeHookHandler;
    onCancel?: SwipeHookHandler;
}

export interface SwipeHookConfig {
    ref?: React.RefCallback<HTMLElement> | React.MutableRefObject<HTMLElement | null>;
    threshold?: (state: SwipeState) => boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
}

// TODO/Alvis, do not use enum here
export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export type Vector2 = [number, number];
