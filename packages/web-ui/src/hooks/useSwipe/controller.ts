import type React from "react";
import type {SwipeHookConfig, SwipeHookHandlers, SwipeHookResult, SwipeEvent, Vector2} from "./type";
import {SwipeUtil} from "../../util/SwipeUtil";

const SWIPE_START_THRESHOLD = 10;

export class Controller {
    private startTime: number = 0;
    private startTouch: React.Touch | null = null;
    private started: boolean = false;
    private handlers: SwipeHookHandlers;
    private config: SwipeHookConfig;

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

    private testThreshold(state: SwipeEvent): boolean {
        return this.config.threshold ? this.config.threshold(state) : state.displacement > SWIPE_START_THRESHOLD;
    }

    private cancel(event: React.TouchEvent) {
        if (this.startTouch) {
            this.onTouchCancel(event);
        }
    }

    private computeEvent(start: React.Touch, changed: React.Touch, event: React.TouchEvent): SwipeEvent {
        const s: Vector2 = [start.clientX, start.clientY];
        const e: Vector2 = [changed.clientX, changed.clientY];
        const delta: Vector2 = [e[0] - s[0], e[1] - s[1]];
        const timeElapsed = Date.now() - this.startTime;
        return {
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

    update(handlers: SwipeHookHandlers, config: SwipeHookConfig = {}) {
        this.handlers = handlers;
        this.config = config;
    }

    createHandlers(): SwipeHookResult {
        return {
            onTouchStart: this.onTouchStart.bind(this),
            onTouchMove: this.onTouchMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this),
            onTouchCancel: this.onTouchCancel.bind(this),
        };
    }
}
