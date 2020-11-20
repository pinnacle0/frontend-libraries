/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires -- env node */

const fs = require("fs");
const path = require("path");

const FilePath = {
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),

    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
};

fs.copyFileSync(FilePath.projectPackageJSON, FilePath.buildPackageJSON);
fs.copyFileSync(FilePath.projectLicense, FilePath.buildLicense);
