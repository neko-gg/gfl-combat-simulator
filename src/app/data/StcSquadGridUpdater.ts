import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadGrid from "@app/model/stc/StcSquadGrid";

export async function updateStcSquadGrid(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5011.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadGrid = stcResult.body.map(row => StcSquadGrid.fromArray(row));
    return writeJson(stcSquadGrid, outputDir, 'SquadGridInfo.json');
}
