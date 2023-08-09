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

type ScreenConfig = {
    content: React.ComponentType<any>;
    location: Location;
    params: Record<string, string>;
    searchParams: Record<string, string>;
    transition: ScreenTransitionSettings;
};

export class Screen {
    readonly content: React.ComponentType<any>;
    readonly location: Location;
    readonly params: Record<string, string>;
    readonly searchParams: Record<string, string>;
    readonly transition: Transition;
    readonly lifecycle = new Lifecycle();

    constructor({content, location, params, transition, searchParams}: ScreenConfig) {
        this.content = content;
        this.location = location;
        this.params = params;
        this.searchParams = searchParams;
        this.transition = new Transition(transition.type, transition.duration);
    }
}
