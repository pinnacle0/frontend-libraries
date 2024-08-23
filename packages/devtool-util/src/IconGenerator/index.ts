import fs from "fs";
import path from "path";
import {PrettierUtil} from "../PrettierUtil";
import {Utility} from "../Utility";
import type {IconGeneratorOptions} from "./type";
import {FontAssetType, generateFonts as fantasticonGenerateFonts, ASSET_TYPES} from "fantasticon";

export class IconGenerator {
    private readonly iconComponentDirectory: string;
    private readonly fontFamily: string;
    private readonly svgDirectory: string;

    private readonly templateDirectory = Utility.getTemplatePath("icon");
    private readonly logger = Utility.createConsoleLogger("IconGenerator");

    private cssContent: string = "";
    private iconClassList: string[] = [];

    constructor(options: IconGeneratorOptions) {
        this.iconComponentDirectory = options.iconComponentDirectory;
        this.fontFamily = options.fontFamily || "iconfont";
        this.svgDirectory = options.svgDirectory;
    }

    async run() {
        try {
            await this.prepareFolder();
            await this.generateFonts();
            this.parseContent();
            this.generateReactComponent();
            this.generateCSSAndAssets();
            this.cleanUp();
        } catch (e) {
            this.logger.error(e);
            process.exit(1);
        }
    }

    private async prepareFolder() {
        this.logger.task(["Copying template to target", this.iconComponentDirectory]);
        Utility.prepareEmptyDirectory(this.iconComponentDirectory);

        for (const file of fs.readdirSync(this.templateDirectory, {encoding: "utf8"})) {
            fs.copyFileSync(`${this.templateDirectory}/${file}`, `${this.iconComponentDirectory}/${path.basename(file, ".template")}`);
        }
    }

    private async generateFonts() {
        this.logger.task("Generating WOFF/TTF by Fantasticon");

        // ref: https://www.npmjs.com/package/fantasticon
        await fantasticonGenerateFonts({
            inputDir: this.svgDirectory,
            outputDir: this.iconComponentDirectory,
            formatOptions: {
                svg: {
                    centerHorizontally: true,
                    centerVertically: true,
                    preserveAspectRatio: true,
                },
            },
            name: this.fontFamily,
            fontTypes: [FontAssetType.WOFF, FontAssetType.TTF],
            assetTypes: [ASSET_TYPES.CSS],
            normalize: false, // the font will be square if true
            fontHeight: 200,
            prefix: "icon",
            getIconId: params => params.basename,
        });
    }

    private parseContent() {
        this.cssContent = fs.readFileSync(path.join(this.iconComponentDirectory, `${this.fontFamily}.css`), "utf-8");
        this.iconClassList = this.cssContent.match(/\.icon-(.*):before/g)!.map(_ => _.slice(1).replace(":before", ""));

        this.logger.info(["CSS parsed, total icons", String(this.iconClassList.length)]);
    }

    private generateReactComponent() {
        const path = `${this.iconComponentDirectory}/index.tsx`;
        this.logger.task(["Generating React Component", path]);

        Utility.replaceTemplate(path, [this.iconClassList.map(_ => `${this.classNameToEnum(_)} = "${_}",`).join("\n"), this.fontFamily, "fantasticon"]);
    }

    private generateCSSAndAssets() {
        const path = `${this.iconComponentDirectory}/iconfont.less`;
        this.logger.task(["Generating LESS", path]);

        Utility.replaceTemplate(path, [
            `url("./${this.fontFamily}.woff") format("woff"), url("./${this.fontFamily}.ttf") format("truetype")`,
            this.fontFamily,
            this.cssContent
                .match(/\.icon-(.|\n)*?\}/g)!
                .map(_ => "&".concat(_))
                .join("\n"),
        ]);
    }

    private cleanUp() {
        this.logger.task("Cleaning up final folder");

        const tempCSS = path.join(this.iconComponentDirectory, `${this.fontFamily}.css`);
        fs.rmSync(tempCSS);

        PrettierUtil.format(this.iconComponentDirectory);
    }

    private classNameToEnum(className: string) {
        if (!/^icon-[a-z\d]+(-[a-z\d]+)*$/.test(className)) {
            throw new Error(`${className} does not conform to naming convention`);
        }
        return className.slice(5).replace(/-/g, "_").toUpperCase();
    }
}
