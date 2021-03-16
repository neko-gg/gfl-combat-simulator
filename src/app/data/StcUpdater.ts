import {request, RequestOptions} from 'http'
import extract from 'extract-zip';
import FormData from 'form-data';
import tmp from 'tmp';
import md5 from "md5";
import path from "path";
import {updateStcGun} from "./StcGunUpdater"
import {updateCatchData} from "./CatchDataUpdater";
import {createDir} from "./WriterUtils";
import {downloadPromise} from "./DownloadUtils";
import {updateStcEnemyTeam} from "./StcEnemyTeamUpdater";
import {updateStcEquip} from "./StcEquipUpdater";
import {updateStcFairy} from "./StcFairyUpdater";
import {getStaticPath} from "../utils/static-loader";
import {updateStcEnemyInTeam} from "./StcEnemyInTeamUpdater";
import {updateStcEnemyCharacterType} from "./StcEnemyCharacterTypeUpdater";
import {updateStcEnemyStandardAttribute} from "./StcEnemyStandardAttributeUpdater";
import {updateStcSquad} from "@app/data/StcSquadUpdater";
import {updateStcSquadStandardAttribution} from "@app/data/StcSquadStandardAttributionUpdater";
import {updateStcSquadType} from "@app/data/StcSquadTypeUpdater";
import {updateStcSquadRank} from "@app/data/StcSquadRankUpdater";
import {updateStcSquadCpuCompletion} from "@app/data/StcSquadCpuCompletionUpdater";
import {updateStcSquadCpu} from "@app/data/StcSquadCpuUpdater";
import {updateStcSquadGrid} from "@app/data/StcSquadGridUpdater";
import {updateStcSquadAdvancedBonus} from "@app/data/StcSquadAdvancedBonusUpdater";
import {updateStcSquadExp} from "@app/data/StcSquadExpUpdater";

async function getDataVersion(): Promise<string> {
    const versionFormData = new FormData();
    versionFormData.append('req_id', `${new Date().getTime() / 1000}00001`);

    const versionOptions: RequestOptions = {
        hostname: 'gf-game.sunborngame.com',
        port: 80,
        path: '/index.php/1001/Index/version',
        method: 'POST',
        headers: versionFormData.getHeaders()
    }

    const versionRequest = request(versionOptions);
    const chunks: Buffer[] = [];

    versionFormData.pipe(versionRequest);
    return new Promise((resolve, reject) => {
        versionRequest.on('response', function (res) {
            res.on('data', chunk => chunks.push(chunk));
            res.on('error', err => reject(err));
            res.on('end', () => {
                const responseBody = chunks.toString();
                const responseJson = JSON.parse(responseBody);
                const dataVersion = responseJson.data_version;
                resolve(dataVersion);
            });
        });
    });
}

async function getStcZipFileName(dataVersion: string): Promise<string> {
    return new Promise(resolve => {
        const hash = md5(dataVersion);
        resolve(`${dataVersion}${hash}`);
    });
}

(async () => {
    const tempDir = tmp.dirSync({prefix: 'gfl-combat-simulator-'});
    const tempDirPath = `${tempDir.name}`;
    const extractDir = path.resolve(tempDirPath, 'stc');
    const outputDir = getStaticPath('stc');
    await createDir(outputDir);

    const dataVersion = await getDataVersion();
    const stcName = await getStcZipFileName(dataVersion);
    const stcZipFile = await downloadPromise(`http://gfus-cdn.sunborngame.com/data/stc_${stcName}.zip`, path.resolve(tempDirPath, 'stc.zip'));
    await extract(stcZipFile, {dir: extractDir});
    await updateStcGun(extractDir, outputDir);
    await updateStcEnemyTeam(extractDir, outputDir);
    await updateStcEnemyInTeam(extractDir, outputDir);
    await updateStcEnemyCharacterType(extractDir, outputDir);
    await updateStcEnemyStandardAttribute(extractDir, outputDir);
    await updateStcEquip(extractDir, outputDir);
    await updateStcFairy(extractDir, outputDir);
    await updateStcSquad(extractDir, outputDir);
    await updateStcSquadStandardAttribution(extractDir, outputDir);
    await updateStcSquadType(extractDir, outputDir);
    await updateStcSquadRank(extractDir, outputDir);
    await updateStcSquadCpuCompletion(extractDir, outputDir);
    await updateStcSquadCpu(extractDir, outputDir);
    await updateStcSquadGrid(extractDir, outputDir);
    await updateStcSquadAdvancedBonus(extractDir, outputDir);
    await updateStcSquadExp(extractDir, outputDir);

    const catchDataPath = path.resolve(tempDirPath, 'stc', 'catchdata.dat');
    const catchDataOutputDir = path.resolve(outputDir, 'catchdata');
    await updateCatchData(catchDataPath, catchDataOutputDir);
})()

