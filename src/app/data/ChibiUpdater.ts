import puppeteer, {Browser} from 'puppeteer'
import path from "path";
import {toByteArray} from "base64-js";
import {createDir} from "./WriterUtils";
import fs from "fs";
import { timeout } from 'promise-timeout';

async function trySpineToPng(browser: Browser, basePath: string, spineDir: string): Promise<void> {
    const page = await browser.newPage();
    await page.goto('https://naganeko.github.io/spine-gif/');

    const input = await page.waitForSelector('#fileElem');

    const spineFiles = ['atlas', 'png', 'skel'].map(ext => path.resolve(basePath, spineDir, `${spineDir}.${ext}`));
    if (!spineFiles.every(spineFile => fs.existsSync(spineFile))) {
        return Promise.reject('could not find all spine files');
    }
    console.log('processing:', spineDir);

    const uploadFiles = await Promise.all(spineFiles);
    await input.uploadFile(...uploadFiles);

    try {
        await page.waitForSelector('option[value="wait"]', {timeout: 10000})
    } catch (e) {
        return Promise.reject('could not find wait animation');
    }

    await page.select('#dousa', 'wait');

    await page.click('#addMotionBtn');
    await page.click('#calcBoundsBtn');
    await page.click('#splitBtn');
    await page.waitForSelector('img.gif_cut', {timeout: 60000});

    const chibiOutputDir = path.resolve(__dirname, '..', '..', 'static', 'chibi', spineDir);
    const chibiOutputPath = path.resolve(chibiOutputDir, `${spineDir}.png`);
    await createDir(chibiOutputDir);

    const pngSource = await page.$eval('img.gif_cut', element => (element as HTMLImageElement).src);
    const pngBase64 = pngSource.replace('data:image/png;base64,', '');
    const pngBytes = toByteArray(pngBase64);
    return fs.promises.writeFile(chibiOutputPath, Buffer.from(pngBytes));
}

async function spineToPng(basePath: string, spineDir: string): Promise<void> {
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true});

    try {
        await timeout(trySpineToPng(browser, basePath, spineDir), 90000);
    } catch (e) {
        console.log(`skipping: ${spineDir};`, e.toString().replace(/\n/g, "").replace(/\s\s+/g, ' '));
    }

    return browser.close();
}

export async function updateChibi(resourcesPath: string): Promise<void> {
    const spinePath = path.resolve(resourcesPath, 'spine');
    const spineDirs = await fs.promises.readdir(spinePath);

    for (const spineDir of spineDirs) {
        // todo: only extract base skin dolls
        // todo: skip 0-frames
        if (['magicbook',
             'mine',
             'mine_beach'].includes(spineDir)) {
            continue;
        }

        try {
            await spineToPng(spinePath, spineDir);
        } catch (e) {
            console.log(`skipping: ${spineDir}; ${e}`)
        }
    }

    return Promise.resolve();
}
