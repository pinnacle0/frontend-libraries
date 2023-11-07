import type {AnimationKeyframe} from "../component/Animated";

export type TransitionType = "entering" | "exiting" | "both" | "none";

export class Transition {
    constructor(
        private type: TransitionType,
        public duration: number
    ) {}

    update(type: TransitionType) {
        this.type = type;
    }

    get enteringKeyframes(): AnimationKeyframe | null {
        switch (this.type) {
            case "both":
            case "entering":
                return {
                    frames: [{transform: `translate3d(100%,0px,0px)`}, {transform: "none"}],
                    options: {duration: this.duration, easing: "cubic-bezier(.05,.74,.3,1.01)"},
                };
            case "exiting":
            case "none":
            default:
                return null;
        }
    }

    get exitingKeyframes(): AnimationKeyframe | null {
        switch (this.type) {
            case "both":
            case "exiting":
                return {
                    frames: [{transform: "none"}, {transform: "translate3d(100%,0px,0px)"}],
                    options: {duration: this.duration, easing: "cubic-bezier(.05,.74,.3,1.01)", fill: "forwards"},
                };
            case "entering":
            case "none":
            default:
                return null;
        }
    }
}
