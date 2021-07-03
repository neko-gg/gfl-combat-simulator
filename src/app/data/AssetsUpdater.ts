import path from "path";
import {createDir} from "./WriterUtils";
import {getStaticPath} from "../utils/static-loader";
import {base64StringToByteArray} from "@app/utils/crypt";
import JsCrypto, {Word32Array} from "jscrypto";
import {getDataVersion} from "@app/data/DataVersionExtractor";
import {downloadPromise} from "@app/data/DownloadUtils";
import tmp from "tmp";
import extract from "extract-zip";
import {execShellCommand} from "@app/data/ShellUtils";
import fs from "fs";

async function getAsset(resDataJson: { BaseAssetBundles: { assetBundleName: string, resname: string }[] }, tempDirPath: string, assetStudioCliExe: string, assetExtractDirName: string, assetBundleName: string, assetBundleZipName: string, assetBundleAbName: string) {
    const assetExtractDir = path.resolve(tempDirPath, assetExtractDirName);
    const assetResName = resDataJson.BaseAssetBundles.find((baseAssetBundle: { assetBundleName: string }) => baseAssetBundle.assetBundleName === assetBundleName).resname;
    const assetResZip = await downloadPromise(`http://gfus-cdn.sunborngame.com/android/${assetResName}.dat`, path.resolve(tempDirPath, assetBundleZipName));
    await extract(assetResZip, {dir: tempDirPath});
    await execShellCommand(assetStudioCliExe + " " + path.resolve(tempDirPath, assetBundleAbName) + " " + assetExtractDir);
}

(async () => {
    const outputDir = getStaticPath(path.join('asset', 'text'));
    await createDir(outputDir);
    const tempDir = tmp.dirSync({prefix: 'gfl-combat-simulator-'});
    const tempDirPath = `${tempDir.name}`;
    const assetStudioExtractDir = path.resolve(tempDirPath, 'asset-studio');
    const resDataExtractDir = path.resolve(tempDirPath, 'res-data');

    const dataVersion = await getDataVersion();
    const minClientVersion = dataVersion.clientVersion.slice(0, -1);
    const abVersion = dataVersion.abVersion;

    const key = new Word32Array(base64StringToByteArray("kxwL8X2+fgM="));
    const iv = new Word32Array(base64StringToByteArray("M9lp+7j2Jdwqr+Yj1h+A"));

    const toEncrypt = `${minClientVersion}_${abVersion}_AndroidResConfigData`;
    const encryptedData = JsCrypto.DES.encrypt(toEncrypt, key, {iv: iv});

    const fileName = encryptedData.toString().replace(/[^a-zA-Z0-9]/g, "");

    const resData = await downloadPromise(`http://gfus-cdn.sunborngame.com/${fileName}.txt`, path.resolve(tempDirPath, 'ResData.ab'));
    const assetStudioCliZip = await downloadPromise("https://github.com/neko-gg/AssetStudio/releases/download/CLI/AssetStudioGUI.zip", path.resolve(tempDirPath, 'AssetStudio.zip'));
    await extract(assetStudioCliZip, {dir: assetStudioExtractDir});
    const assetStudioCliExe = path.resolve(assetStudioExtractDir, "AssetStudioCLI.exe");

    await execShellCommand(assetStudioCliExe + " " + resData + " " + resDataExtractDir);

    const rawResDataJson = await fs.promises.readFile(path.resolve(resDataExtractDir, "MonoBehaviour", "ResData.json"), {encoding: "utf-8"});
    const resDataJson = JSON.parse(rawResDataJson);

    await getAsset(resDataJson, tempDirPath, assetStudioCliExe, 'asset-textes', "asset_textes", 'AssetTextes.zip', 'asset_textes.ab');
    await getAsset(resDataJson, tempDirPath, assetStudioCliExe, 'asset-text-table', "asset_texttable", 'AssetTextTable.zip', 'asset_texttable.ab');

    const assetTextTablePath = path.resolve(tempDirPath, 'asset-text-table', 'TextAsset');

    await fs.promises.copyFile(path.resolve(assetTextTablePath, 'gun.txt'), path.resolve(outputDir, 'tdoll.txt'));
    await fs.promises.copyFile(path.resolve(assetTextTablePath, 'equip.txt'), path.resolve(outputDir, 'equip.txt'));
    await fs.promises.copyFile(path.resolve(assetTextTablePath, 'fairy.txt'), path.resolve(outputDir, 'fairy.txt'));
    await fs.promises.copyFile(path.resolve(assetTextTablePath, 'enemy_character_type.txt'), path.resolve(outputDir, 'enemy_character_type.txt'));
    await fs.promises.copyFile(path.resolve(assetTextTablePath, 'squad.txt'), path.resolve(outputDir, 'squad.txt'));

    console.log(tempDirPath);
})()

