import fs from "fs";
import pako from "pako";
import {writeJson} from "./WriterUtils";

async function writeCatchData(catchDataLine: string, outputDir: string): Promise<void> {
    const catchData = JSON.parse(catchDataLine);
    const rootCatchDataKey = Object.keys(catchData)[0];
    const rootCatchDataValue = catchData[rootCatchDataKey];

    return writeJson(rootCatchDataValue, outputDir, `${rootCatchDataKey}.json`)
}

export async function updateCatchData(path: string, outputDir: string): Promise<void> {
    const catchData = await new Promise<Buffer>(((resolve, reject) => {
        fs.readFile(path, ((err, data) => {
            err ? reject(err) : resolve(data);
        }));
    }));

    const key = new TextEncoder().encode('c88d016d261eb80ce4d6e41a510d4048');
    const decryptedCatchData = catchData.map((byte, i) => byte ^ key[i % key.length]);
    const decompressedCatchData = pako.ungzip(decryptedCatchData);
    const decodedCatchData = new TextDecoder().decode(decompressedCatchData);

    await Promise.all(decodedCatchData.split('\n')
                                      .map(catchDataLine => catchDataLine.trim())
                                      .filter(catchDataLine => catchDataLine)
                                      .map(catchDataLine => writeCatchData(catchDataLine, outputDir)));
}
