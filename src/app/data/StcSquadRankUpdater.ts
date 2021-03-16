import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadRank from "@app/model/stc/StcSquadRank";

export async function updateStcSquadRank(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5020.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadRank = stcResult.body.map(row => StcSquadRank.fromArray(row));
    return writeJson(stcSquadRank, outputDir, 'SquadRankInfo.json');
}
