import fs from "fs-extra";
import {pathMap} from "../config/path-map";

describe("Project path mappings", () => {
    Object.entries(pathMap)
        .filter(([itemName]) => !itemName.startsWith("build") && !itemName.startsWith("dist"))
        .forEach(([itemName, itemPath]) => {
            test(itemName, () => {
                expect(fs.pathExistsSync(itemPath)).toBeTruthy();
            });
        });
});
