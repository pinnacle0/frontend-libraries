import {useEffect, useState} from "react";
import {AnimatePresence} from "../AnimationPresence";
import {RouteContext} from "../../context";
import {Animated} from "../Animated";
import type {Location} from "history";
import type {InternalHistoryState, Router, Screen} from "../../router";
import type {AnimationKeyFrame} from "../Animated";
import "./index.less";

export function StackRouter({router}: {router: Router}) {
    const [screens, setScreens] = useState<Screen[]>([]);

    useEffect(() => {
        return router.listen(_ => setScreens([..._]));
    }, [router]);

    return (
        <div className="g-stack-router">
            <AnimatePresence>
                {screens.map(({param, location, component: Component}) => (
                    <Animated className="g-stack-router-screen" key={location.key} duration={450} onEnter={() => getEnteringKeyframes(location)} onExit={() => getExitingKeyframes(location)}>
                        <RouteContext.Provider value={{param, location}}>
                            <Component />
                        </RouteContext.Provider>
                    </Animated>
                ))}
            </AnimatePresence>
        </div>
    );
}

const getEnteringKeyframes = (location: Location): AnimationKeyFrame => {
    const state = location.state as InternalHistoryState;
    switch (state?.__transition) {
        case "both":
        case "entering":
            return [{transform: `translateX(100%)`}, {transform: `translateX(0px)`}];
        case "exiting":
        case "none":
        default:
            return null;
    }
};

const getExitingKeyframes = (location: Location) => {
    const state = location.state as InternalHistoryState;
    switch (state?.__transition) {
        case "both":
        case "exiting":
            return [{transform: "translateX(100%)"}];
        case "entering":
        case "none":
        default:
            return null;
    }
};
