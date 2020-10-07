/* eslint-disable @typescript-eslint/no-var-requires -- testcafe does not load tsconfig correctly */

// Copied from ssim wiki (https://github.com/obartra/ssim/wiki/Node-and-Browsers)
// with the following changes:
// - bmp support is removed (to remove bmp-js dependency)
// - loading image via url and filepath is removed
// - promise are converted to async functions

const Canvas = require("canvas") as typeof import("canvas");
const imageType = require("image-type") as typeof import("image-type");

/**
 * If `limit` is set, it will return proportional dimensions to `width` and `height` with the
 * smallest dimesion limited to `limit`.
 */
function getLimitDimensions(width: number, height: number, limit?: number) {
    if (limit && width >= limit && height >= limit) {
        const ratio = width / height;
        if (ratio > 1) {
            return {height: limit, width: Math.round(limit / ratio)};
        }
        return {height: Math.round(limit * ratio), width: limit};
    }
    return {width, height};
}

/**
 * Parses the buffer data and returns it. If `limit` is set, it will make sure the smallest dimesion
 * will at most be of size `limit`.
 */
async function parse(data: Buffer, limit: number): Promise<ImageData> {
    const {ext = ""} = imageType(data) || {};
    if (ext === "bmp") {
        throw new Error("[SSIMUtil] bmp file format is not supported");
    }
    const img = await Canvas.loadImage(data);
    const {width, height} = getLimitDimensions(img.width, img.height, limit);
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}

// TODO: readPixels
async function readpixels(buffer: Buffer, limit = 0): Promise<ImageData> {
    if (!Buffer.isBuffer(buffer)) {
        throw new Error("[SSIMUtil.readpixels] Invalid buffer");
    }
    return await parse(buffer, limit);
}

// TODO: why not put <root>/e2e to <root>/test/e2e-test/, more unified
export const SSIMUtil = {
    getLimitDimensions,
    readpixels,
};
