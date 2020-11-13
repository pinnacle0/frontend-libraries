/**
 * This function draws line on canvas between the center of nodes.
 *
 * Attention:
 * canvasContext should share the same offsetParent with the nodes.
 */
function drawPathBetweenNodes(nodes: NodeListOf<Element>, canvasContext: CanvasRenderingContext2D, strokeColor: string) {
    canvasContext.save();
    canvasContext.beginPath();
    const [first, ...rest] = Array.from(nodes).map(elementCenter);
    if (first) {
        canvasContext.moveTo(first.x, first.y);
        rest.forEach(node => {
            if (node) {
                canvasContext.lineTo(node.x, node.y);
            }
        });
    }
    canvasContext.lineWidth = 1;
    canvasContext.strokeStyle = strokeColor;
    canvasContext.stroke();
    canvasContext.restore();
}

function elementCenter(element: Element | null): {x: number; y: number} | null {
    if (element) {
        const htmlElement = element as HTMLSpanElement;
        return {
            x: htmlElement.offsetLeft + htmlElement.offsetWidth / 2,
            y: htmlElement.offsetTop + htmlElement.offsetHeight / 2,
        };
    } else {
        return null;
    }
}

export const CanvasUtil = Object.freeze({
    drawPathBetweenNodes,
});
