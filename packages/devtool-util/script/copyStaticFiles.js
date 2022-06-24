const fs = require("fs");
const {copySync: fsExtraCopySync} = require("fs-extra");
const path = require("path");

const FilePath = {
    projectPackageJSON: path.join(__dirname, "../package.json"),
    projectLicense: path.join(__dirname, "../LICENSE.md"),
    projectCoreFEModuleTemplateDirectory: path.join(__dirname, "../src/ModuleGenerator/core-fe-template"),
    projectCoreNativeModuleTemplateDirectory: path.join(__dirname, "../src/ModuleGenerator/core-native-template"),
    projectWebIconTemplateDirectory: path.join(__dirname, "../src/IconFontGenerator/web-icon-template"),
    projectAppIconTemplateDirectory: path.join(__dirname, "../src/IconFontGenerator/app-icon-template"),
    projectIconTemplateDirectory: path.join(__dirname, "../src/IconGenerator/icon-template"),

    buildPackageJSON: path.join(__dirname, "../build/package.json"),
    buildLicense: path.join(__dirname, "../build/LICENSE.md"),
    buildCoreFEModuleTemplateDirectory: path.join(__dirname, "../build/src/ModuleGenerator/core-fe-template"),
    buildCoreNativeModuleTemplateDirectory: path.join(__dirname, "../build/src/ModuleGenerator/core-native-template"),
    buildWebIconTemplateDirectory: path.join(__dirname, "../build/src/IconFontGenerator/web-icon-template"),
    buildAppIconTemplateDirectory: path.join(__dirname, "../build/src/IconFontGenerator/app-icon-template"),
    buildIconTemplateDirectory: path.join(__dirname, "../build/src/IconGenerator/icon-template"),
};

fs.copyFileSync(FilePath.projectPackageJSON, FilePath.buildPackageJSON);
fs.copyFileSync(FilePath.projectLicense, FilePath.buildLicense);

fsExtraCopySync(FilePath.projectCoreFEModuleTemplateDirectory, FilePath.buildCoreFEModuleTemplateDirectory, {recursive: true});
fsExtraCopySync(FilePath.projectCoreNativeModuleTemplateDirectory, FilePath.buildCoreNativeModuleTemplateDirectory, {recursive: true});
fsExtraCopySync(FilePath.projectWebIconTemplateDirectory, FilePath.buildWebIconTemplateDirectory, {recursive: true});
fsExtraCopySync(FilePath.projectAppIconTemplateDirectory, FilePath.buildAppIconTemplateDirectory, {recursive: true});
fsExtraCopySync(FilePath.projectIconTemplateDirectory, FilePath.buildIconTemplateDirectory, {recursive: true});
