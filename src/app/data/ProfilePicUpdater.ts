import path from "path";
import fs from "fs";
import {createDir} from "./WriterUtils";

export async function updateProfilePic(resourcesPath: string): Promise<unknown> {
    const picPath = path.resolve(resourcesPath, 'pic');
    const picFiles = await fs.promises.readdir(picPath);

    const profilePicFiles = picFiles.filter(picFile => picFile.startsWith('pic_'))
                                    .filter(picFile => picFile.endsWith('_n.png'));

    const profilePicOutputDir = path.resolve(__dirname, '..', '..', 'static', 'profile-pic');
    await createDir(profilePicOutputDir);

    for (const profilePicFile of profilePicFiles) {
        const profilePicPath = path.resolve(picPath, profilePicFile);
        const profilePicOutputPath = path.resolve(profilePicOutputDir, profilePicFile);
        await fs.promises.copyFile(profilePicPath, profilePicOutputPath);
    }

    return new Promise<void>(resolve => resolve());
}
