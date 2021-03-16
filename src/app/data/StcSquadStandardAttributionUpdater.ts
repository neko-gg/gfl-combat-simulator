import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadStandardAttribution from "@app/model/stc/StcSquadStandardAttribution";

export async function updateStcSquadStandardAttribution(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5021.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadStandardAttribution = stcResult.body.map(row => StcSquadStandardAttribution.fromArray(row));
    return writeJson(stcSquadStandardAttribution, outputDir, 'SquadStandardAttributionInfo.json');
}
