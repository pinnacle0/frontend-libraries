import React from "react";
import type {DragHandler} from "../../hooks/useDrag/type";
import {useDraggable} from "../../hooks/useDraggable";
import {classNames} from "../../util/ClassNames";
import {ReactUtil} from "../../util/ReactUtil";

interface Props {
    onResizeStart: DragHandler;
    onResize: DragHandler;
    gap?: number;
    className?: string;
}

export const Resizer = ReactUtil.memo("Resizer", ({onResizeStart, onResize, gap, className}: Props) => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const bind = useDraggable({target: ref, onDragStart: onResizeStart, onDrag: onResize, disabled: true, gap});

    return <div className={classNames("resizer", className)} ref={ref} {...bind} />;
});
