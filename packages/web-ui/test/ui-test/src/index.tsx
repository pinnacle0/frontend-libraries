import React from "react";
import ReactDOM from "react-dom/client";
import {Main} from "./component/Main";
import "@pinnacle0/web-ui/css/global.less";
import "./index.less";

ReactDOM.createRoot(document.querySelector("#app-root")!).render(<Main />);
