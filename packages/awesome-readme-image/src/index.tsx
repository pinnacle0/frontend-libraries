/* eslint-disable react/jsx-fragments, react/jsx-uses-react, react/react-in-jsx-scope -- new jsx transform */

import "core-js";
import * as ReactDOM from "react-dom";
import {UglyImage} from "./ugly-image";
import {dimensions} from "./values";

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
