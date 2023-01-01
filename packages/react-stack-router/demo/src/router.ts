import {createBrowserHistory} from "history";
import {createRouter} from "../../src";

const history = createBrowserHistory();
export const router = createRouter(history);
