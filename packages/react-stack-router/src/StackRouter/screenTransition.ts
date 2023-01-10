export type ScreenTransitionType = "entering" | "exiting" | "both" | "none";

export class ScreenTransition {
    constructor(private type: ScreenTransitionType) {}

    update(type: ScreenTransitionType) {
        this.type = type;
    }

    getEnteringKeyframes(): Keyframe[] | null {
        switch (this.type) {
            case "both":
            case "entering":
                return [{transform: `translate3d(100%,0px,0px)`}, {transform: `translate3d(0px,0px,0px)`}];
            case "exiting":
            case "none":
            default:
                return null;
        }
    }

    getExitingKeyframes(): Keyframe[] | null {
        switch (this.type) {
            case "both":
            case "exiting":
                return [{transform: "translate3d(100%,0px,0px)"}];
            case "entering":
            case "none":
            default:
                return null;
        }
    }
}
