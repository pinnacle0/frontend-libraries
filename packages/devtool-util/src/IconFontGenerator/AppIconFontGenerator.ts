import axios from "axios";
import * as fs from "fs";
import {Agent} from "https";
import * as path from "path";
import {Utility} from "../Utility";
import {AppIconFontGeneratorOptions} from "./type";
import yargs = require("yargs");

const print = Utility.createConsoleLogger("IconFontGenerator");

export class AppIconFontGenerator {
    private readonly iconComponentFile: string;
    private readonly androidFontPath: string;
    private readonly iosFontPath: string;

    private readonly templateFile = path.join(__dirname, "./app-icon-template/Icon.tsx.template");
    private readonly cssURL = String(yargs.argv._[0]);

    constructor(options: AppIconFontGeneratorOptions) {
        this.iconComponentFile = options.iconComponentFile;
        this.androidFontPath = options.androidFontPath;
        this.iosFontPath = options.iosFontPath;
    }

    async generate() {
        try {
            if (!this.cssURL) throw new Error("Missing CSS URL in command line");
            print.info(`usage: yarn icon ${this.cssURL}`);
            const cssContent = await this.getContent(this.cssURL);
            await this.parseCSS(cssContent, this.cssURL);
        } catch (e) {
            print.error(e.message);
            process.exit(1);
        }
    }

    private async parseCSS(content: string, cssURL: string) {
        // Retrieve icon items
        const iconClassList = [];
        const iconClassRegex = /\.icon-?(.*):before(?:.|\n)*?"\\(.*)"/g;

        let matchedClassAndUnicode: RegExpExecArray | null;
        while ((matchedClassAndUnicode = iconClassRegex.exec(content)) !== null) {
            iconClassList.push(`${this.classNameToEnum(matchedClassAndUnicode[1])} = 0x${matchedClassAndUnicode[2]}`);
        }

        // Retrieve TTF URL
        const matchedURL = /url\('(.*?\.ttf).*?'\)/.exec(content);
        if (!matchedURL) throw new Error("Cannot find TTF Path");
        const ttfURL = matchedURL[1]; // Captured URL part
        print.info(["😍 Downloading TTF:", ttfURL]);

        // Download TTF to iOS/Android folder
        await this.downloadFontAsset(ttfURL, this.androidFontPath);
        await this.downloadFontAsset(ttfURL, this.iosFontPath);

        // Copy template to target
        const componentContent = fs
            .readFileSync(this.templateFile, {encoding: "utf8"})
            .replace("{1}", cssURL)
            .replace("// {2}", iconClassList.map(_ => `    ${_},`).join("\n"));
        fs.writeFileSync(this.iconComponentFile, componentContent, {encoding: "utf8"});

        print.info(`😍 Generated ${iconClassList.length} icons`);
    }

    private classNameToEnum(className: string) {
        if (!/^[a-zA-Z]+[a-zA-Z\d]*(-[a-zA-Z\d]+)*$/.test(className)) {
            throw new Error(`${className} does not conform to naming convention`);
        }

        return className.replace(/-/g, "_").toUpperCase();
    }

    private async downloadFontAsset(url: string, filepath: string) {
        if (url.startsWith("//")) url = "http:" + url;
        const response = await axios({url, responseType: "stream"});
        response.data.pipe(fs.createWriteStream(filepath, {encoding: "utf8"}));
        return new Promise((resolve, reject) => {
            response.data.on("end", resolve);
            response.data.on("error", reject);
        });
    }

    private async getContent(url: string) {
        if (url.startsWith("//")) url = `http:${url}`;
        const response = await axios.get(url, {httpsAgent: new Agent({rejectUnauthorized: false})});
        return response.data;
    }
}
