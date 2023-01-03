import type {Location} from "history";

export type ScreenTransitionType = "enter" | "exiting" | "both";

export interface Screen {
    location: Location;
    component: React.ComponentType<any>;
    param: {[key: string]: string};
    transition: ScreenTransitionType;
}

export const getScreenTransition = (type: ScreenTransitionType | undefined): {onEnter?: Keyframe[]; onExit?: Keyframe[]} => {
    const onEnter: Keyframe[] = [{transform: `translateX(100%)`}, {transform: `translateX(0px)`}];
    const onExit: Keyframe[] = [{transform: "translateX(100%)"}];

    switch (type) {
        case "both":
            return {onEnter, onExit};
        case "enter":
            return {onEnter};
        case "exiting":
            return {onExit};
        default:
            return {};
    }
};
