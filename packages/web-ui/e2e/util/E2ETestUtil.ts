import * as fs from "fs";
import * as path from "path";
import {ssim} from "ssim.js";
import {Selector} from "testcafe";
import {SSIMUtil} from "./SSIMUtil";

interface TestControllerExtra {
    testRun: {
        test: {
            id: string;
            name: string;
            testFile: {
                id: string;
                filename: string;
                currentFixture: {
                    id: string;
                    name: string;
                    path: string;
                };
            };
        };
        opts: {
            screenshots: {
                path: string;
            };
            tsConfigPath: string | undefined;
        };
        browserConnection: {
            id: string;
            browserInfo: {
                alias: string;
            };
        };
    };
}

const demoContainerSelector = Selector(".demo-helper-container");

async function compareScreenshot(t: TestController, failureThreshold: number = 0.95): Promise<{screenshotFilename: string; screenshotFilepath: string}> {
    const testController = t as TestController & TestControllerExtra;
    if (!(0 <= failureThreshold && failureThreshold <= 1)) {
        throw new Error(`[E2ETestUtil.compareScreenshot] failureThreshold must be within range 0 to 1, received \`${failureThreshold}\``);
    }
    const screenshotDirectory = testController.testRun.opts.screenshots.path;
    const currentFilepath = testController.testRun.test.testFile.filename;
    const currentTestName = testController.testRun.test.name;
    const currentFixtureName = testController.testRun.test.testFile.currentFixture.name;
    if (typeof screenshotDirectory !== "string") {
        throw new Error(`[E2ETestUtil.compareScreenshot] Invalid screenshotDirectory: \`${screenshotDirectory}\``);
    } else if (typeof currentFilepath !== "string") {
        throw new Error(`[E2ETestUtil.compareScreenshot] Invalid currentFilepath: \`${currentFilepath}\``);
    } else if (typeof currentTestName !== "string") {
        throw new Error(`[E2ETestUtil.compareScreenshot] Invalid currentTestName: \`${currentTestName}\``);
    } else if (typeof currentFixtureName !== "string") {
        throw new Error(`[E2ETestUtil.compareScreenshot] Invalid currentFixtureName: \`${currentFixtureName}\``);
    }

    const projectRootDirectory = (function () {
        let i = 0;
        while (i < screenshotDirectory.length && screenshotDirectory[i] === currentFilepath[i]) ++i;
        return screenshotDirectory.substring(0, i);
    })();
    const screenshotFilename = `${currentFixtureName}_${currentTestName}.png`;
    const screenshotFilepath = path.join(screenshotDirectory, currentFilepath.replace(projectRootDirectory, ""), screenshotFilename);
    const relativeScreenshotFilepath = screenshotFilepath.replace(screenshotDirectory, "").replace(/^[\\/]/, "");

    if (!(fs.existsSync(screenshotFilepath) && fs.statSync(screenshotFilepath).isFile())) {
        await testController.takeElementScreenshot(demoContainerSelector, relativeScreenshotFilepath);
        console.info(`[E2ETestUtil.compareScreenshot] Saved 1 new screenshot: \`${screenshotFilename}\``);
    } else {
        const newImageSuffix = ".new.png";
        await testController.takeElementScreenshot(demoContainerSelector, relativeScreenshotFilepath.concat(newImageSuffix));
        const originalImageData: ImageData = await SSIMUtil.readpixels(fs.readFileSync(screenshotFilepath));
        const newImageData: ImageData = await SSIMUtil.readpixels(fs.readFileSync(screenshotFilepath.concat(newImageSuffix)));
        console.info(`[E2ETestUtil.compareScreenshot] Starting image ssim for \`${screenshotFilename}\``);
        console.info(
            [
                // Original Image dimension
                `org.img.dim:   ${originalImageData.height} * ${originalImageData.width}`,
                // New Image dimension
                `new.img.dim:   ${newImageData.height} * ${newImageData.width}`,
            ]
                .map(_ => `\t${_}\n`)
                .join("")
        );
        const {mssim, performance, ssim_map} = ssim(originalImageData, newImageData, {
            windowSize: 11, // (default: 11); window size for the SSIM map
            k1: 0.01, // (default: 0.01); first stability constant
            k2: 0.03, // (default: 0.03); second stability constant
            bitDepth: 8, // (default: 8); number of bits used to encode each pixel
            downsample: "original", // (default: 'original'); false: disables downsizing; 'original': (default) implements the same downsizing than the original Matlab scripts; 'fast': relies on the canvas to do the downsizing (may lead to different results)
            ssim: "weber", // (default: 'weber'); 'original': Uses a line-by-line port of the Matlab scripts and attempts to match them as closely as possible; 'fast': Uses a mathematically equivalent approach to 'original' but it's computationally faster; 'bezkrovny': Uses a faster approach that similarly correlates with SSIM but doesn't match the original results exactly; 'weber': Is the fastest approach. Similar to Bezkrovny's, the results are close to but don't match the original SSIM results
        });
        console.info(`[E2ETestUtil.compareScreenshot] Completed image ssim for \`${screenshotFilename}\``);
        console.info(
            [
                // Structural similarity: number from 0 to 1; closer to 1 = higher similarity
                `struct.sim:    ${mssim}`,
                // Failure threshold: number from 0 to 1; structural similarity threshold before failing the test
                `fail.thresh:   ${failureThreshold}`,
                // Performance: execution time of similarity comparison
                `performance:   ${performance}ms`,
                // Image dimension: dimension of comparison matrix
                `img.dimension: ${ssim_map.height} * ${ssim_map.width}`,
            ]
                .map(_ => `\t${_}\n`)
                .join("")
        );
        await testController.expect(mssim).gte(failureThreshold);
        fs.unlinkSync(screenshotFilepath.concat(newImageSuffix));
    }

    return {screenshotFilename, screenshotFilepath};
}

export const E2ETestUtil = {
    compareScreenshot,
};
