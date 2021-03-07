import StcReader from "./StcReader";
import StcGun from "../model/stc/StcGun";
import {writeJson} from "./WriterUtils";
import path from "path";

export async function updateStcGun(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5005.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcGuns = stcResult.body.map(row => StcGun.fromArray(row));
    return writeJson(stcGuns, outputDir, 'GunInfo.json');
}
