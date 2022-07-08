import type React from "react";
import type {SwipeHookConfig, SwipeHookHandlers, SwipeState, TouchEventHandlers, Vector2} from "./type";
import {SwipeUtil} from "../../util/SwipeUtil";

const SWIPE_START_THRESHOLD = 10;

export class Controller {
    private startTime: number = 0;
    private startTouch: React.Touch | null = null;
    private started: boolean = false;
    private handlers: SwipeHookHandlers;
    private config: SwipeHookConfig;
    private targetNode: HTMLElement | null = null;
    private nativeTouchMoveListener: ((e: TouchEvent) => void) | undefined;

    constructor() {
        this.handlers = {};
        this.config = {};
    }

    private onTouchStart(e: React.TouchEvent) {
        if (e.changedTouches[0] && !this.startTouch) {
            this.startTouch = e.changedTouches[0];
            this.startTime = Date.now();
        }
    }

    private onTouchMove(e: React.TouchEvent) {
        const matchedTouches = this.matchTouches(e);
        if (!matchedTouches) {
            return;
        }
        const state = this.computeEvent(matchedTouches.start, matchedTouches.changed, e);

        if (!this.started && this.testThreshold(state)) {
            this.started = true;
            this.handlers.onStart?.(state);
            return;
        } else if (this.started) {
            this.handlers.onMove?.(state);
        }
    }

    private onTouchEnd(e: React.TouchEvent) {
        if (!this.started) {
            this.reset();
            return;
        }
        const matchedTouches = this.matchTouches(e);
        if (!matchedTouches) {
            return;
        }
        const state = this.computeEvent(matchedTouches.start, matchedTouches.changed, e);
        this.handlers.onEnd?.(state);
        this.reset();
    }

    private onTouchCancel(e: React.TouchEvent) {
        if (!this.started) {
            this.reset();
            return;
        }
        const matchedTouches = this.matchTouches(e);
        if (!matchedTouches) {
            return;
        }
        const state = this.computeEvent(matchedTouches.start, matchedTouches.changed, e);
        this.handlers.onCancel?.(state);
        this.reset();
    }

    private testThreshold(state: SwipeState): boolean {
        return state.displacement > SWIPE_START_THRESHOLD && (this.config.threshold?.(state) ?? true);
    }

    private cancel(event: React.TouchEvent) {
        if (this.startTouch) {
            this.onTouchCancel(event);
        }
    }

    private computeEvent(start: React.Touch, changed: React.Touch, event: React.TouchEvent): SwipeState {
        const s: Vector2 = [start.clientX, start.clientY];
        const e: Vector2 = [changed.clientX, changed.clientY];
        const delta: Vector2 = [e[0] - s[0], e[1] - s[1]];
        const timeElapsed = Date.now() - this.startTime;
        return {
            clientX: changed.clientX,
            clientY: changed.clientY,
            startTouch: start,
            delta,
            direction: SwipeUtil.getDirection(s, e),
            displacement: SwipeUtil.getDisplacement(s, e),
            // TODO/Alvis, need to improve velocity calculation
            velocity: [Math.abs(delta[0]) / timeElapsed, Math.abs(delta[1]) / timeElapsed],
            syntheticEvent: event,
            cancel: (() => this.cancel(event)).bind(this),
        };
    }

    private matchTouches(e: React.TouchEvent): {start: React.Touch; changed: React.Touch} | null {
        if (!this.startTouch) {
            return null;
        }
        const touch = Array.from(e.changedTouches).find(_ => _.identifier === this.startTouch!.identifier);
        if (!touch) {
            return null;
        } else {
            return {
                start: this.startTouch,
                changed: touch,
            };
        }
    }

    private reset() {
        this.startTime = 0;
        this.startTouch = null;
        this.started = false;
    }

    private preventDefault(event: TouchEvent) {
        if (event.cancelable && this.config.preventDefault) {
            event.preventDefault();
        }
    }

    update(handlers: SwipeHookHandlers, config: SwipeHookConfig = {}) {
        this.handlers = handlers;
        this.config = config;
    }

    createRef() {
        return (node: HTMLElement | null) => {
            if (this.targetNode && this.nativeTouchMoveListener) {
                this.targetNode.removeEventListener("touchmove", this.nativeTouchMoveListener);
                this.targetNode = null;
                this.nativeTouchMoveListener = undefined;
            }

            if (node) {
                this.targetNode = node;
                this.nativeTouchMoveListener = this.preventDefault.bind(this);
                this.targetNode.addEventListener("touchmove", this.nativeTouchMoveListener, {passive: false});
            }
        };
    }

    createHandlers(): TouchEventHandlers {
        return {
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onTouchCancel: this.onTouchCancel.bind(this),
        };
    }
}
