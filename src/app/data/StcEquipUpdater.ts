import StcReader from "./StcReader";
import {writeJson} from "./WriterUtils";
import path from "path";
import StcEquip from "../model/stc/StcEquip";

export async function updateStcEquip(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5038.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcEquips = stcResult.body.map(row => StcEquip.fromArray(row));
    return writeJson(stcEquips, outputDir, 'EquipInfo.json');
}
