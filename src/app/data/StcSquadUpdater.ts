import path from "path";
import StcSquad from "@app/model/stc/StcSquad";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";

export async function updateStcSquad(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5006.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquad = stcResult.body.map(row => StcSquad.fromArray(row));
    return writeJson(stcSquad, outputDir, 'SquadInfo.json');
}
