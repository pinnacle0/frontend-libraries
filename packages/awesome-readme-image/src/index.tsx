import "core-js";
import {Fragment} from "react";
import ReactDOM from "react-dom/client";
import {UglyImage} from "./ugly-image";
import {dimensions} from "./values";

const DevPreviewApp = () => (
    <Fragment>
        <main>
            <UglyImage style={dimensions} />
        </main>
        <style>{`
            body {
                margin: 1em;
                padding: 0;
                background-color: #666;
            }
        `}</style>
    </Fragment>
);

ReactDOM.createRoot(document.getElementById("root")!).render(<DevPreviewApp />);
