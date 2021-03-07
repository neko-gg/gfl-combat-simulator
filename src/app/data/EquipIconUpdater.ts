import path from "path";
import {createDir} from "./WriterUtils";
import fs from "fs";

export async function updateEquipIcon(resourcesPath: string): Promise<void> {
    const equipIconPath = path.resolve(resourcesPath, 'icon', 'equip');
    const equipIcons = await fs.promises.readdir(equipIconPath);

    const equipIconOutputDir = path.resolve(__dirname, '..', '..', 'static', 'icon', 'equip');
    await createDir(equipIconOutputDir);

    for (const equipIcon of equipIcons) {
        const equipIconHex = `${Buffer.from(equipIcon.replace(/\.png$/, '').toLowerCase()).toString('hex')}.png`;
        await fs.promises.copyFile(path.resolve(equipIconPath, equipIcon), path.resolve(equipIconOutputDir, equipIconHex));
    }

    return new Promise<void>(resolve => resolve());
}
