interface DrawPathOptions {
    strokeColor: string;
    lineWidth?: number;
    /** shorten the path between node from both ends */
    offset?: number;
}
/**
 * This function draws line on canvas between the center of nodes.
 *
 * Attention:
 * canvasContext must share the same offsetParent with the nodes.
 */
function drawPathBetweenNodes(nodes: NodeListOf<Element>, canvasContext: CanvasRenderingContext2D, {strokeColor, lineWidth = 1, offset = 0}: DrawPathOptions) {
    const [first, ...rest] = Array.from(nodes).map(_ => elementCenter(_, canvasContext.canvas.offsetParent));
    if (!first) return;
    const drawWithOffset = offset > 0;
    let previousPosition = first;

    canvasContext.save();
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = strokeColor;

    if (!drawWithOffset) {
        canvasContext.beginPath();
        canvasContext.moveTo(previousPosition.x, previousPosition.y);
    }
    for (const position of rest) {
        if (position) {
            if (drawWithOffset) {
                canvasContext.beginPath();
                canvasContext.moveTo(previousPosition.x, previousPosition.y);
                canvasContext.setLineDash([0, offset, Math.sqrt((position.x - previousPosition.x) ** 2 + (position.y - previousPosition.y) ** 2) - offset * 2, offset, 0]);
                previousPosition = position;
            }
            canvasContext.lineTo(position.x, position.y);
            if (drawWithOffset) canvasContext.stroke();
        }
    }
    if (!drawWithOffset) canvasContext.stroke();
    canvasContext.restore();
}

function elementCenter(element: Element, canvasParentElement: Element | null): {x: number; y: number} {
    const htmlElement = element as HTMLElement;
    let x = htmlElement.offsetLeft + htmlElement.offsetWidth / 2;
    let y = htmlElement.offsetTop + htmlElement.offsetHeight / 2;
    let parentElement = htmlElement.offsetParent as HTMLElement | null;
    while (parentElement && canvasParentElement && parentElement !== canvasParentElement) {
        x = x + parentElement.offsetLeft;
        y = y + parentElement.offsetTop;
        parentElement = parentElement.offsetParent as HTMLElement | null;
    }
    return {
        x,
        y,
    };
}

export const CanvasUtil = Object.freeze({
    drawPathBetweenNodes,
});
