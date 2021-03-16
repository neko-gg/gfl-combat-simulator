import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadAdvancedBonus from "@app/model/stc/StcSquadAdvancedBonus";

export async function updateStcSquadAdvancedBonus(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5007.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadAdvancedBonus = stcResult.body.map(row => StcSquadAdvancedBonus.fromArray(row));
    return writeJson(stcSquadAdvancedBonus, outputDir, 'SquadAdvancedBonusInfo.json');
}
