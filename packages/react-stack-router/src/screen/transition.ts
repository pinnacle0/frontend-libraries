export type TransitionType = "entering" | "exiting" | "both" | "none";

export class Transition {
    constructor(
        private type: TransitionType,
        public duration: number
    ) {}

    update(type: TransitionType) {
        this.type = type;
    }

    get enteringKeyframes(): Keyframe[] | null {
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

    get exitingKeyframes(): Keyframe[] | null {
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
