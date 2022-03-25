import React from "react";
import {useSwipe} from "@pinnacle0/web-ui/hooks/useSwipe";
import {useTransition} from "@pinnacle0/web-ui/hooks/useTransition";
import "./index.less";

export const SwipeDemo = () => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const {transit, clear} = useTransition(ref);
    const bind = useSwipe({
        onStart: () => {},
        onMove: state => {
            if (state.delta[1] > 300) {
                state.cancel();
            } else {
                transit(state.delta[0], state.delta[1]);
            }
        },
        onEnd: state => {
            clear();
        },
        onCancel: state => {
            state.cancel;
            clear();
        },
    });

    return (
        <div {...bind} className="swipe-demo" ref={ref}>
            content
        </div>
    );
};
