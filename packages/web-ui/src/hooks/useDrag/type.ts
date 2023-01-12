export type Vector = [number, number];

export interface DragState {
    delta: Vector;
    event: MouseEvent;
}

export type DragHandler = (state: DragState) => void;

export interface DragConfig {
    onDragStart?: DragHandler;
    onDrag?: DragHandler;
    onDragEnd?: DragHandler;
}
