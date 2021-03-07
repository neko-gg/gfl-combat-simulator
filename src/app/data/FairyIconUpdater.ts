import path from "path";
import {createDir} from "./WriterUtils";
import fs from "fs";

export async function updateFairyIcon(resourcesPath: string): Promise<void> {
    const fairyIconPath = path.resolve(resourcesPath, 'fairy');
    const fairyIcons = (await fs.promises.readdir(fairyIconPath, {withFileTypes: true})).filter(dirent => dirent.isFile()).map(dirent => dirent.name);

    const fairyIconOutputDir = path.resolve(__dirname, '..', '..', 'static', 'icon', 'fairy');
    await createDir(fairyIconOutputDir);

    for (const fairyIcon of fairyIcons) {
        await fs.promises.copyFile(path.resolve(fairyIconPath, fairyIcon), path.resolve(fairyIconOutputDir, fairyIcon));
    }

    return new Promise<void>(resolve => resolve());
}
