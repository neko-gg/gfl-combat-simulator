import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadExp from "@app/model/stc/StcSquadExp";

export async function updateStcSquadExp(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5013.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadExp = stcResult.body.map(row => StcSquadExp.fromArray(row));
    return writeJson(stcSquadExp, outputDir, 'SquadExpInfo.json');
}
