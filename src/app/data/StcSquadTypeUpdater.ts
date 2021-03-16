import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadType from "@app/model/stc/StcSquadType";

export async function updateStcSquadType(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5022.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadType = stcResult.body.map(row => StcSquadType.fromArray(row));
    return writeJson(stcSquadType, outputDir, 'SquadTypeInfo.json');
}
