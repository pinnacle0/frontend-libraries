import fs from "fs";
import path from "path";
import {PrettierUtil} from "../PrettierUtil.js";
import {Utility} from "../Utility/index.js";
import type {IconGeneratorOptions} from "./type.js";
import {FontAssetType, generateFonts as fantasticonGenerateFonts, ASSET_TYPES} from "fantasticon";

export class IconGenerator {
    private readonly iconComponentDirectory: string;
    private readonly fontFamily: string;
    private readonly svgDirectory: string;

    private readonly templateDirectory = Utility.getTemplatePath("icon");
    private readonly logger = Utility.createConsoleLogger("IconGenerator");

    private cssContent = "";
    private iconClassList: string[] = [];

    constructor(options: IconGeneratorOptions) {
        this.iconComponentDirectory = options.iconComponentDirectory;
        this.fontFamily = options.fontFamily || "iconfont";
        this.svgDirectory = options.svgDirectory;
    }

    async run() {
        try {
            this.normalizeImageSize();
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

    private normalizeImageSize() {
        const widthRegex = / width="([a-zA-z0-9.]+)"/;
        const heightRegex = / height="([a-zA-z0-9.]+)"/;
        const imgs = fs.readdirSync(this.svgDirectory);

        this.logger.task("Normalizing image size");
        imgs.forEach(img => {
            const imgPath = path.join(this.svgDirectory, img);
            const content = fs.readFileSync(imgPath, {encoding: "utf-8"});

            const widthMatch = content.match(widthRegex);
            const heightMatch = content.match(heightRegex);

            const width = widthMatch?.[1];
            const height = heightMatch?.[1];

            if (!width || !height) {
                return;
            }

            const numericWidth = Number(width);
            const numericHeight = Number(height);
            const longerSide = Math.max(numericHeight, numericWidth);

            if (longerSide < 200) {
                let newWidth;
                let newHeight;

                if (longerSide === numericWidth) {
                    newWidth = 200;
                    newHeight = (numericHeight * 200) / numericWidth;
                } else {
                    newHeight = 200;
                    newWidth = (numericWidth * 200) / numericHeight;
                }
                const replacedImgContent = content.replace(widthRegex, ` width="${newWidth}"`).replace(heightRegex, ` height="${newHeight}"`);
                fs.writeFileSync(imgPath, replacedImgContent, {encoding: "utf-8"});
                this.logger.info(["Normalized image: ", imgPath]);
            }
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
