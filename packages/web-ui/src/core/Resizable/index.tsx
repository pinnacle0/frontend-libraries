import React from "react";
import {Resizer} from "./Resizer";
import {classNames} from "../../util/ClassNames";
import type {DragState} from "../../hooks/useDraggable/type";
import {useCompositeRef} from "../../hooks/useCompositeRef";
import type {RefObject} from "react";
import "./index.less";

interface Rect {
    top: number;
    right: number;
    left: number;
    bottom: number;
    width: number;
    height: number;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    ref: RefObject<HTMLDivElement>;
    x: number;
    y: number;
    initialHeight: number;
    initialWidth: number;
    minHeight?: number;
    minWidth?: number;
    maxHeight?: number;
    maxWidth?: number;
    gap?: number;
}

export const Resizable = ({
    initialHeight,
    initialWidth,
    x,
    y,
    className,
    style,
    gap,
    children,
    ref,
    maxHeight = window.innerHeight,
    maxWidth = window.innerWidth,
    minHeight = 0,
    minWidth = 0,
    ...restProps
}: Props) => {
    const resizableRef = React.useRef<HTMLDivElement | null>(null);
    const startRect = React.useRef<Rect>({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0});
    const compositeRef = useCompositeRef(resizableRef, ref);

    const onResizeStart = () => {
        if (resizableRef.current) {
            const {top, right, bottom, left, width, height} = resizableRef.current.getBoundingClientRect();
            startRect.current = {top, right, bottom, left, width, height};
        }
    };

    const onResizeTop = (state: DragState) => {
        if (resizableRef.current) {
            const {top, height} = startRect.current;
            const deltaY = state.delta[1];
            const transformedHeight = height - deltaY;
            if (transformedHeight < minHeight || transformedHeight > maxHeight) {
                return;
            }
            resizableRef.current.style.top = `${top + deltaY}px`;
            resizableRef.current.style.height = `${transformedHeight}px`;
        }
    };

    const onResizeRight = (state: DragState) => {
        if (resizableRef.current) {
            const {width} = startRect.current;
            const transformedWidth = width + state.delta[0];
            if (transformedWidth < minWidth || transformedWidth > maxWidth) {
                return;
            }
            resizableRef.current.style.width = `${transformedWidth}px`;
        }
    };

    const onResizeBottom = (state: DragState) => {
        if (resizableRef.current) {
            const {height} = startRect.current;
            const transformedHeight = height + state.delta[1];
            if (transformedHeight < minHeight || transformedHeight > maxHeight) {
                return;
            }
            resizableRef.current.style.height = `${transformedHeight}px`;
        }
    };

    const onResizeLeft = (state: DragState) => {
        if (resizableRef.current) {
            const {left, width} = startRect.current;
            const deltaX = state.delta[0];
            const transformedWidth = width - deltaX;
            if (transformedWidth < minWidth || transformedWidth > maxWidth) {
                return;
            }
            resizableRef.current.style.left = `${left + deltaX}px`;
            resizableRef.current.style.width = `${transformedWidth}px`;
        }
    };

    return (
        <div className={classNames("g-resizable", className)} ref={compositeRef} style={{...style, height: initialHeight, width: initialWidth, top: y, left: x}} {...restProps}>
            <Resizer className="top" onResizeStart={onResizeStart} onResize={onResizeTop} gap={gap} />
            <Resizer
                className="top-right"
                gap={gap}
                onResizeStart={onResizeStart}
                onResize={state => {
                    onResizeTop(state);
                    onResizeRight(state);
                }}
            />
            <Resizer className="right" gap={gap} onResizeStart={onResizeStart} onResize={onResizeRight} />
            <Resizer
                className="bottom-right"
                gap={gap}
                onResizeStart={onResizeStart}
                onResize={state => {
                    onResizeRight(state);
                    onResizeBottom(state);
                }}
            />
            <Resizer className="bottom" gap={gap} onResizeStart={onResizeStart} onResize={onResizeBottom} />
            <Resizer
                className="bottom-left"
                gap={gap}
                onResizeStart={onResizeStart}
                onResize={state => {
                    onResizeBottom(state);
                    onResizeLeft(state);
                }}
            />
            <Resizer className="left" gap={gap} onResizeStart={onResizeStart} onResize={onResizeLeft} />
            <Resizer
                className="top-left"
                gap={gap}
                onResizeStart={onResizeStart}
                onResize={state => {
                    onResizeTop(state);
                    onResizeLeft(state);
                }}
            />
            <div className="g-resizable-body">{children}</div>
        </div>
    );
};
