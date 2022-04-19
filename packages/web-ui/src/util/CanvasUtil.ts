interface DrawPathOptions {
    strokeColor: string;
    lineWidth?: number;
}
/**
 * This function draws line on canvas between the center of nodes.
 *
 * Attention:
 * canvasContext must share the same offsetParent with the nodes.
 */
function drawPathBetweenNodes(nodes: NodeListOf<Element>, canvasContext: CanvasRenderingContext2D, {strokeColor, lineWidth = 1}: DrawPathOptions) {
    canvasContext.save();
    canvasContext.beginPath();
    const [first, ...rest] = Array.from(nodes).map(_ => elementCenter(_, canvasContext.canvas.offsetParent));
    if (first) {
        canvasContext.moveTo(first.x, first.y);
        rest.forEach(node => {
            if (node) {
                canvasContext.lineTo(node.x, node.y);
            }
        });
    }
    canvasContext.lineWidth = lineWidth;
    canvasContext.strokeStyle = strokeColor;
    canvasContext.stroke();
    canvasContext.restore();
}

function elementCenter(element: Element | null, canvasParentElement: Element | null): {x: number; y: number} | null {
    if (element) {
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
    } else {
        return null;
    }
}

export const CanvasUtil = Object.freeze({
    drawPathBetweenNodes,
});
