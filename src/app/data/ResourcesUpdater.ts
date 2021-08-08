import tmp from "tmp";
import path from "path";
import AdmZip from "adm-zip";
import {downloadPromise} from "./DownloadUtils";
import {updateChibi} from "./ChibiUpdater";
import {updateEquipIcon} from "./EquipIconUpdater";
import {updateProfilePic} from "./ProfilePicUpdater";
import {updateFairyIcon} from "./FairyIconUpdater";

(async () => {
    const tempDir = tmp.dirSync({prefix: 'gfl-combat-simulator-'});
    const tempDirPath = `${tempDir.name}`;
    const tempResourcesPath = path.resolve(tempDirPath, 'girlsfrontline-resources.zip');

    await downloadPromise('https://github.com/36base/girlsfrontline-resources/archive/master.zip', tempResourcesPath);
    const resourcesZip = new AdmZip(tempResourcesPath);
    await new Promise<void>((resolve, reject) => resourcesZip.extractAllToAsync(tempDirPath, true, error => error ? reject(error) : resolve()));
    console.log('resources extracted in:', tempDirPath);
    const resourcesPath = path.resolve(tempDirPath, 'girlsfrontline-resources-master');

    await updateChibi(resourcesPath);
    await updateEquipIcon(resourcesPath);
    await updateFairyIcon(resourcesPath);
    await updateProfilePic(resourcesPath);
})();
