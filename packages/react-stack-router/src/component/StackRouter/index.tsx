import {useEffect, useState} from "react";
import {AnimatePresence} from "../AnimationPresence";
import {RouteContext} from "../../context";
import {Animated} from "../Animated";
import type {InternalHistoryState, Router} from "../../router";
import {getScreenTransition} from "../../screen";
import type {Screen} from "../../screen";
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
                    <Animated className="g-stack-router-screen" key={location.key} duration={450} {...getScreenTransition((location.state as InternalHistoryState).__transition)}>
                        <RouteContext.Provider value={{param, location}}>
                            <Component />
                        </RouteContext.Provider>
                    </Animated>
                ))}
            </AnimatePresence>
        </div>
    );
}
