import type {Location} from "history";
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

export interface ScreenHooks {
    /**
     * Run before enter animation start
     */
    onWillEnter?: (() => void) | undefined;
    /**
     * Run after enter animation
     */
    onDidEnter?: (() => void) | undefined;
    /**
     * Run before exit animation start
     */
    onWillExit?: (() => void) | undefined;
    /**
     * Run after exit animation
     */
    onDidExit?: (() => void) | undefined;
}

export class Screen {
    content: React.ComponentType<any>;
    history: HistoryInfo;
    hooks: ScreenHooks;
    transition: ScreenTransition;

    constructor(config: {content: React.ComponentType<any>; history: HistoryInfo; transition: ScreenTransitionSettings; hooks: ScreenHooks}) {
        this.content = config.content;
        this.history = config.history;
        this.hooks = config.hooks;
        this.transition = new ScreenTransition(config.transition.type, config.transition.duration);
    }
}
