import path from "path";
import {createDir} from "./WriterUtils";
import {downloadPromise} from "./DownloadUtils";
import {getStaticPath} from "../utils/static-loader";

(async () => {
    const outputDir = getStaticPath(path.join('asset', 'text'));
    await createDir(outputDir);

    await downloadPromise('https://raw.githubusercontent.com/Dimbreath/GirlsFrontlineData/master/en-US/asset_textes/table/gun.txt', path.resolve(outputDir, 'tdoll.txt'));
    await downloadPromise('https://raw.githubusercontent.com/Dimbreath/GirlsFrontlineData/master/en-US/asset_textes/table/equip.txt', path.resolve(outputDir, 'equip.txt'));
    await downloadPromise('https://raw.githubusercontent.com/Dimbreath/GirlsFrontlineData/master/en-US/asset_textes/table/fairy.txt', path.resolve(outputDir, 'fairy.txt'));
    await downloadPromise('https://raw.githubusercontent.com/Dimbreath/GirlsFrontlineData/master/en-US/asset_textes/table/enemy_character_type.txt', path.resolve(outputDir, 'enemy_character_type.txt'));
    await downloadPromise('https://raw.githubusercontent.com/Dimbreath/GirlsFrontlineData/master/en-US/asset_textes/table/squad.txt', path.resolve(outputDir, 'squad.txt'));
})()

