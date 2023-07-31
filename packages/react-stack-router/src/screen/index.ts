import {Lifecycle} from "./lifecycle";
import {Transition} from "./transition";
import type {Location} from "../type";
import type {TransitionType} from "./transition";

export interface HistoryInfo {
    location: Location;
    params: Record<string, string>;
}

export interface ScreenTransitionSettings {
    duration: number;
    type: TransitionType;
}

export class Screen {
    readonly content: React.ComponentType<any>;
    readonly history: HistoryInfo;
    readonly transition: Transition;
    readonly lifecycle = new Lifecycle();

    constructor({content, history, transition}: {content: React.ComponentType<any>; history: HistoryInfo; transition: ScreenTransitionSettings}) {
        this.content = content;
        this.history = history;
        this.transition = new Transition(transition.type, transition.duration);
    }
}
