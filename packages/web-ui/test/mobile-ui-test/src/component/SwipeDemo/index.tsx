import React from "react";
import {Direction, useSwipe} from "@pinnacle0/web-ui/hooks/useSwipe";
import {useTransition} from "@pinnacle0/web-ui/hooks/useTransition";
import "./index.less";

export const SwipeDemo = () => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const {transit, clear} = useTransition(ref);
    const bind = useSwipe({
        onStart: () => {},
        onMove: event => {
            const [dx, dy] = event.delta;
            if (dy > 300) {
                event.cancel();
            } else {
                transit({x: dx, y: dy, immediate: true});
            }
        },
        onEnd: event => {
            clear();
        },
        onCancel: event => {
            clear();
        },
    });

    return (
        <div {...bind} className="swipe-demo" ref={ref}>
            content
        </div>
    );
};
