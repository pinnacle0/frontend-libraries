import type React from "react";

export type TouchHandlers = Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "onTouchStart" | "onTouchMove" | "onTouchEndCapture" | "onTouchCancelCapture">;

export interface SwipeHookResult {
    onTouchMove: React.TouchEventHandler;
    onTouchStart: React.TouchEventHandler;
    onTouchEnd: React.TouchEventHandler;
    onTouchCancel: React.TouchEventHandler;
}

export interface SwipeEvent {
    syntheticEvent: React.TouchEvent;
    displacement: number;
    delta: Vector2;
    velocity: Vector2;
    direction: Direction;
    cancel: () => void;
}

type SwipeHookHandler = (event: SwipeEvent) => void;

export interface SwipeHookHandlers {
    onStart?: SwipeHookHandler;
    onEnd?: SwipeHookHandler;
    onMove?: SwipeHookHandler;
    onCancel?: SwipeHookHandler;
}

export interface SwipeHookConfig {
    threshold?: (state: SwipeEvent) => boolean;
    preventDefault?: boolean;
}

export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export type Vector2 = [number, number];
