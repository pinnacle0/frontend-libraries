import "core-js";
import * as ReactDOM from "react-dom";
import {UglyImage} from "./ugly-image";
import {dimensions} from "./values";

/* eslint-disable @typescript-eslint/no-use-before-define, react/jsx-fragments, react/jsx-uses-react, react/react-in-jsx-scope -- React 16.14.0 */
declare const React: null;

const DevPreviewApp = () => (
    <>
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
    </>
);

ReactDOM.render(<DevPreviewApp />, document.getElementById("root"));
