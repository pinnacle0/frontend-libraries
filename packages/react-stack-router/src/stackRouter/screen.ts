import type {Location} from "history";
import {ScreenLifecycle} from "./screenLifecycle";
import type {ScreenTransitionType} from "./screenTransition";
import {ScreenTransition} from "./screenTransition";

export interface HistoryInfo {
    location: Location;
    params: Record<string, string>;
}

export interface ScreenTransitionSettings {
    duration: number;
    type: ScreenTransitionType;
}

export class Screen {
    readonly content: React.ComponentType<any>;
    readonly history: HistoryInfo;
    readonly transition: ScreenTransition;
    readonly lifecycle = new ScreenLifecycle();

    constructor({content, history, transition}: {content: React.ComponentType<any>; history: HistoryInfo; transition: ScreenTransitionSettings}) {
        this.content = content;
        this.history = history;
        this.transition = new ScreenTransition(transition.type, transition.duration);
    }
}
