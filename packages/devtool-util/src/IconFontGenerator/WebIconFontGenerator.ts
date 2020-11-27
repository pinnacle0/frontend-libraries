import axios from "axios";
import * as fs from "fs-extra";
import {Agent} from "https";
import {PrettierUtil} from "../PrettierUtil";
import {Utility} from "../Utility";
import {WebIconFontGeneratorOptions} from "./types";
import yargs = require("yargs");

const print = Utility.createConsoleLogger("IconFontGenerator");

export class WebIconFontGenerator {
    private readonly componentBasePath: string;
    private readonly staticPath: string;
    private readonly templatePath: string;
    private readonly cssURL: string;
    private readonly fontFamily: string;

    private cssContent: string = "";
    private iconClassList: string[] = [];

    constructor(options: WebIconFontGeneratorOptions) {
        this.componentBasePath = options.componentBasePath;
        this.staticPath = options.staticPath;
        this.templatePath = options.templatePath;
        this.cssURL = options.cssURL || yargs.argv._[0];
        this.fontFamily = options.fontFamily || "iconfont";
    }

    async run() {
        try {
            await this.getContent();
            await this.prepareFolder();
            this.parseClassList();
            this.generateReactComponent();
            this.generateCSSAndAssets();
            this.generatePreviewHTML();
            this.formatSources();
        } catch (e) {
            print.error(e);
            process.exit(1);
        }
    }

    private async getContent() {
        if (!this.cssURL) {
            throw new Error("CSS URL must be specified (via command line, or constructor)");
        }

        const fullCSSURL = this.cssURL.startsWith("//") ? "http:" + this.cssURL : this.cssURL;
        print.task(["Fetching CSS content", fullCSSURL]);

        const response = await axios.get(fullCSSURL, {httpsAgent: new Agent({rejectUnauthorized: false})});
        this.cssContent = response.data;
    }

    private async prepareFolder() {
        print.task(["Copying template to target", this.componentBasePath]);

        Utility.prepareEmptyDirectory(this.componentBasePath);

        fs.copySync(this.templatePath, this.componentBasePath);
        fs.moveSync(this.componentBasePath + "/icon.html", this.staticPath + "/icon.html", {overwrite: true});
    }

    private parseClassList() {
        this.iconClassList = this.cssContent.match(/\.icon-(.*):before/g)!.map(_ => _.substr(1).replace(":before", ""));

        print.info(["Parsed CSS class, total", String(this.iconClassList.length)]);
    }

    private generateReactComponent() {
        const path = this.componentBasePath + "/index.tsx";
        print.task(["Generating React Component", path]);

        Utility.replaceTemplate(path, [this.iconClassList.map(_ => `${this.classNameToEnum(_)} = "${_}",`).join("\n")]);
    }

    private generateCSSAndAssets() {
        const path = this.componentBasePath + "/iconfont.less";
        print.task(["Generating LESS", path]);

        const assetURLs = this.cssContent.match(/url\('(.|\n)*?'\)/g)!.map(_ => _.substring(5, _.length - 2));
        Utility.replaceTemplate(path, [
            assetURLs
                .map(url => this.transformToLocalURL(url))
                .filter(_ => _)
                .join(","),
            this.cssContent.match(/\.icon-(.|\n)*?\}/g)!.join("\n"),
            this.fontFamily,
        ]);
    }

    private generatePreviewHTML() {
        const path = this.staticPath + "/icon.html";
        print.task(["Generating static HTML for icon preview", path]);

        const icons = this.iconClassList.map(_ => `<div class="item"><i class="iconfont ${_}"></i><span>${this.classNameToEnum(_)}</span></div>`);
        Utility.replaceTemplate(path, [this.cssURL, icons.join(""), new Date().toLocaleString()]);
    }

    private formatSources() {
        print.task("Format generated sources");
        PrettierUtil.format(this.componentBasePath);
    }

    private transformToLocalURL(url: string) {
        const downloadFontAsset = async (fileName: string) => {
            const path = this.componentBasePath + "/" + fileName;
            if (url.startsWith("//")) url = "http:" + url;
            const response = await axios({url, responseType: "stream"});
            response.data.pipe(fs.createWriteStream(path));
            response.data.on("error", (error: Error) => {
                print.error(error);
                process.exit(1);
            });
        };

        if (url.startsWith("data:application/x-font-woff2;")) {
            print.task(["Copying font asset (woff2)", "Using inline data"]);
            return `url("${url}") format("woff")`;
        } else {
            const assetExtension = this.getExtension(url);
            if (assetExtension === "ttf") {
                print.task(["Copying font asset (ttf)", url]);

                downloadFontAsset("iconfont.ttf");
                return `url("./iconfont.ttf") format("truetype")`;
            } else if (assetExtension === "woff") {
                print.task(["Copying font asset (woff)", url]);

                downloadFontAsset("iconfont.woff");
                return `url("./iconfont.woff") format("woff")`;
            } else {
                return null;
            }
        }
    }

    private getExtension(url: string) {
        let extension = url.substr(url.lastIndexOf(".") + 1);
        const questionMarkIndex = extension.indexOf("?");
        if (questionMarkIndex > 0) extension = extension.substr(0, questionMarkIndex);
        return extension.toLowerCase();
    }

    private classNameToEnum(className: string) {
        if (!/^icon-[a-z\d]+(-[a-z\d]+)*$/.test(className)) {
            throw new Error(`${className} does not conform to naming convention`);
        }
        return className.substring(5).replace(/-/g, "_").toUpperCase();
    }
}
