import {Utility} from "@pinnacle0/devtool-util";
import path from "path";

const directory = {
    src: path.join(__dirname, "../src"),
    test: path.join(__dirname, "../test"),
};

Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.src]);
Utility.runCommand("eslint", ["--ext=.js,.jsx,.ts,.tsx", directory.test]);

Utility.runCommand("stylelint", [path.join(directory.src, "**/*.{css,less}")]);
Utility.runCommand("stylelint", [path.join(directory.test, "**/*.{css,less}")]);
