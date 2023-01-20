import type {DragConfig, DragState, Vector} from "./type";

export class DragController {
    private dragStarted: boolean = false;
    private startPosition: Vector = [0, 0];
    private config: DragConfig = {};

    private createState = (event: MouseEvent): DragState => {
        return {
            delta: [event.clientX - this.startPosition[0], event.clientY - this.startPosition[1]],
            event,
        };
    };

    private setStartPosition = (x: number, y: number) => {
        this.startPosition[0] = x;
        this.startPosition[1] = y;
    };

    onDrag = (event: MouseEvent) => {
        this.dragStarted && this.config.onDrag?.(this.createState(event));
    };

    onDragStart: React.MouseEventHandler = event => {
        // disable right click event
        if (event.nativeEvent.button !== 0) return;
        if (event.currentTarget !== event.target) return;

        event.preventDefault();
        this.setStartPosition(event.clientX, event.clientY);
        this.dragStarted = true;
        this.config.onDragStart?.(this.createState(event.nativeEvent));
    };

    onDragEnd = (event: MouseEvent) => {
        if (this.dragStarted) {
            this.dragStarted = false;
            this.config.onDragEnd?.(this.createState(event));
        }
    };

    updateHandlers = (config: DragConfig) => {
        this.config = config;
    };
}
