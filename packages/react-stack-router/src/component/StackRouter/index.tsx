import {useEffect, useState} from "react";
import {AnimatePresence} from "../AnimationPresence";
import {RouteContext} from "../../context";
import {Animated} from "../Animated";
import type {Router, Stack} from "../../router";
import "./index.less";

export function StackRouter({router}: {router: Router}) {
    const [stack, setStack] = useState<Stack[]>([]);

    useEffect(() => {
        return router.listen(_ => setStack([..._]));
    }, [router]);

    return (
        <div className="g-stack-router">
            <AnimatePresence>
                {stack.map(({param, location, component: Component}) => (
                    <Animated
                        className="g-stack-router-screen"
                        key={location.key}
                        onEnter={[{transform: `translateX(100%)`}, {transform: `translateX(0px)`}]}
                        onExit={[{transform: "translateX(100%)"}]}
                        duration={450}
                    >
                        <RouteContext.Provider value={{param, location}}>
                            <Component />
                        </RouteContext.Provider>
                    </Animated>
                ))}
            </AnimatePresence>
        </div>
    );
}
