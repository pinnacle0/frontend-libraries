import React from "react";
import {Resizer} from "./Resizer";
import {classNames} from "../../util/ClassNames";
import type {DragState} from "../../hooks/useDrag/type";
import "./index.less";

interface Rect {
    top: number;
    right: number;
    left: number;
    bottom: number;
    width: number;
    height: number;
}

interface Props {
    id?: string;
    className?: string;
    height: number;
    width: number;
    minHeight?: number;
    minWidth?: number;
    maxHeight?: number;
    maxWidth?: number;
    gap?: number;
    children?: React.ReactNode;
}

export const Resizable = React.forwardRef<HTMLDivElement, Props>(
    ({height, width, className, id, gap, children, maxHeight = window.innerHeight, maxWidth = window.innerWidth, minHeight = 0, minWidth = 0}, ref) => {
        const resizableDivRef = React.useRef<HTMLDivElement | null>(null);
        const startRect = React.useRef<Rect>({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0});

        const combineRef = (node: HTMLDivElement) => {
            if (node) {
                if (ref) {
                    typeof ref === "function" ? ref(node) : (ref.current = node);
                }
                resizableDivRef.current = node;
            }
        };

        const onResizeStart = () => {
            if (resizableDivRef.current) {
                const {top, right, bottom, left, width, height} = resizableDivRef.current.getBoundingClientRect();
                startRect.current = {top, right, bottom, left, width, height};
            }
        };

        const onResizeTop = (state: DragState) => {
            if (resizableDivRef.current) {
                const {top, height} = startRect.current;
                const deltaY = state.delta[1];
                const transformedHeight = height - deltaY;
                if (transformedHeight < minHeight || transformedHeight > maxHeight) {
                    return;
                }
                resizableDivRef.current.style.top = `${top + deltaY}px`;
                resizableDivRef.current.style.height = `${transformedHeight}px`;
            }
        };

        const onResizeRight = (state: DragState) => {
            if (resizableDivRef.current) {
                const {width} = startRect.current;
                const transformedWidth = width + state.delta[0];
                if (transformedWidth < minWidth || transformedWidth > maxWidth) {
                    return;
                }
                resizableDivRef.current.style.width = `${transformedWidth}px`;
            }
        };

        const onResizeBottom = (state: DragState) => {
            if (resizableDivRef.current) {
                const {height} = startRect.current;
                const transformedHeight = height + state.delta[1];
                if (transformedHeight < minHeight || transformedHeight > maxHeight) {
                    return;
                }
                resizableDivRef.current.style.height = `${transformedHeight}px`;
            }
        };

        const onResizeLeft = (state: DragState) => {
            if (resizableDivRef.current) {
                const {left, width} = startRect.current;
                const deltaX = state.delta[0];
                const transformedWidth = width - deltaX;
                if (transformedWidth < minWidth || transformedWidth > maxWidth) {
                    return;
                }
                resizableDivRef.current.style.left = `${left + deltaX}px`;
                resizableDivRef.current.style.width = `${transformedWidth}px`;
            }
        };

        return (
            <div className={classNames("resizable", className)} id={id} ref={combineRef} style={{height, width}}>
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
                {children}
            </div>
        );
    }
);
