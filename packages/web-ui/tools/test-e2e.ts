import {pathMap} from "../config/path-map";
import {runCommand} from "./util";

const {projectDirectory} = pathMap;

export default function testE2E() {
    runCommand(
        String.raw`yarn run \
        --cwd="${projectDirectory}" \
        testcafe \
        "chrome --headless --window-size='800,600' --app-shell-host-window-size='800,600' --content-shell-host-window-size='800,600'" \
        "./e2e/**/*.e2e.{ts,tsx}" \
        --skip-js-errors \
        --screenshots path=artifacts/screenshots \
        --ts-config-path ./e2e/tsconfig.json`
    );
}
