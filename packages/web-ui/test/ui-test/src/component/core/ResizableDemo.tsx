import React from "react";
import type {DemoHelperGroupConfig} from "../DemoHelper";
import {DemoHelper} from "../DemoHelper";
import {Resizable} from "@pinnacle0/web-ui/core/Resizable";
import {useDraggable} from "@pinnacle0/web-ui/hooks/useDraggable";

const DraggableResizableDemo = () => {
    const draggableRef = React.useRef<HTMLDivElement | null>(null);
    const bind = useDraggable({target: draggableRef});

    return (
        <Resizable ref={draggableRef} initialHeight={200} initialWidth={200} minHeight={200} minWidth={200} maxHeight={500} maxWidth={500} x={300} y={400}>
            <div style={{width: "100%", height: 50, background: "red"}} {...bind}>
                Drag me
            </div>
        </Resizable>
    );
};

const groups: DemoHelperGroupConfig[] = [
    {
        title: "Test",
        components: [<DraggableResizableDemo />],
    },
];

export const ResizableDemo = () => <DemoHelper groups={groups} />;
