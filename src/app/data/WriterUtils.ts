import path from "path";
import fs, {WriteFileOptions} from "fs";

export async function createDir(outputDir: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.mkdir(outputDir, {recursive: true}, err => {
            err ? reject(err) : resolve()
        });
    });
}

export async function writeFile(path: string, data: string | Buffer, options: WriteFileOptions = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, data, options, err => {
            err ? reject(err) : resolve();
        });
    });
}

export async function writeJson(object: unknown, outputDir: string, jsonName: string): Promise<void> {
    await createDir(outputDir);

    const objectJson = JSON.stringify(object, null, 4);
    const outputPath = path.resolve(outputDir, jsonName);

    return writeFile(outputPath, objectJson);
}

