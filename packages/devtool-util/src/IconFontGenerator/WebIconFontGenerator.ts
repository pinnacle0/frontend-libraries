import axios from "axios";
import fs from "fs";
import {Agent} from "https";
import path from "path";
import yargs from "yargs";
import {PrettierUtil} from "../PrettierUtil";
import {Utility} from "../Utility";
import type {WebIconFontGeneratorOptions} from "./type";

export class WebIconFontGenerator {
    private readonly iconComponentDirectory: string;
    private readonly staticDirectory: string;
    private readonly fontFamily: string;

    private readonly templateDirectory = path.join(__dirname, "./web-icon-template");
    private readonly cssURL = String(yargs.argv._[0]);

    private cssContent: string = "";
    private iconClassList: string[] = [];

    private readonly logger = Utility.createConsoleLogger("IconFontGenerator");

    constructor(options: WebIconFontGeneratorOptions) {
        this.iconComponentDirectory = options.iconComponentDirectory;
        this.staticDirectory = options.staticDirectory;
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
            this.logger.error(e);
            process.exit(1);
        }
    }

    private async getContent() {
        if (!this.cssURL) {
            throw new Error("CSS URL must be specified (via command line, or constructor)");
        }

        const fullCSSURL = this.cssURL.startsWith("//") ? `http:${this.cssURL}` : this.cssURL;
        this.logger.task(["Fetching CSS content", fullCSSURL]);

        const response = await axios.get(fullCSSURL, {httpsAgent: new Agent({rejectUnauthorized: false})});
        this.cssContent = response.data;
    }

    private async prepareFolder() {
        this.logger.task(["Copying template to target", this.iconComponentDirectory]);
        Utility.prepareEmptyDirectory(this.iconComponentDirectory);

        for (const file of fs.readdirSync(this.templateDirectory, {encoding: "utf8"})) {
            fs.copyFileSync(`${this.templateDirectory}/${file}`, `${this.iconComponentDirectory}/${path.basename(file, ".template")}`);
        }
        fs.renameSync(`${this.iconComponentDirectory}/icon.html`, `${this.staticDirectory}/icon.html`);
    }

    private parseClassList() {
        this.iconClassList = this.cssContent.match(/\.icon-(.*):before/g)!.map(_ => _.substr(1).replace(":before", ""));

        this.logger.info(["Parsed CSS class, total", String(this.iconClassList.length)]);
    }

    private generateReactComponent() {
        const path = `${this.iconComponentDirectory}/index.tsx`;
        this.logger.task(["Generating React Component", path]);

        Utility.replaceTemplate(path, [this.iconClassList.map(_ => `${this.classNameToEnum(_)} = "${_}",`).join("\n"), this.fontFamily, this.cssURL]);
    }

    private generateCSSAndAssets() {
        const path = `${this.iconComponentDirectory}/iconfont.less`;
        this.logger.task(["Generating LESS", path]);

        const assetURLs = this.cssContent.match(/url\('(.|\n)*?'\)/g)!.map(_ => _.substring(5, _.length - 2));
        Utility.replaceTemplate(path, [
            assetURLs
                .map(url => this.transformToLocalURL(url))
                .filter(_ => _)
                .join(","),
            this.fontFamily,
            this.cssContent
                .match(/\.icon-(.|\n)*?\}/g)!
                .map(_ => "&".concat(_))
                .join("\n"),
        ]);
    }

    private generatePreviewHTML() {
        const path = `${this.staticDirectory}/icon.html`;
        this.logger.task(["Generating static HTML for icon preview", path]);

        const icons = this.iconClassList.map(_ => `<div class="item"><i class="g-${this.fontFamily}-icon ${_}"></i><span>${this.classNameToEnum(_)}</span></div>`);
        Utility.replaceTemplate(path, [this.cssURL, this.fontFamily, icons.join(""), new Date().toLocaleString()]);
    }

    private formatSources() {
        this.logger.task("Format generated sources");
        PrettierUtil.format(this.iconComponentDirectory);
    }

    private transformToLocalURL(url: string) {
        const downloadFontAsset = async (fileName: string) => {
            const path = `${this.iconComponentDirectory}/${fileName}`;
            if (url.startsWith("//")) url = "http:" + url;
            const response = await axios({url, responseType: "stream"});
            response.data.pipe(fs.createWriteStream(path, {encoding: "utf8"}));
            response.data.on("error", (error: Error) => {
                this.logger.error(error);
                process.exit(1);
            });
        };

        if (url.startsWith("data:application/x-font-woff2;")) {
            this.logger.task(["Copying font asset (woff2)", "Using inline data"]);
            return `url("${url}") format("woff")`;
        } else {
            const assetExtension = this.getExtension(url);
            if (assetExtension === "ttf") {
                this.logger.task(["Copying font asset (ttf)", url]);

                downloadFontAsset("iconfont.ttf");
                return `url("./iconfont.ttf") format("truetype")`;
            } else if (assetExtension === "woff") {
                this.logger.task(["Copying font asset (woff)", url]);

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
