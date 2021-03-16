import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadCpuCompletion from "@app/model/stc/StcSquadCpuCompletion";

export async function updateStcSquadCpuCompletion(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5019.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadCpuCompletion = stcResult.body.map(row => StcSquadCpuCompletion.fromArray(row));
    return writeJson(stcSquadCpuCompletion, outputDir, 'SquadCpuCompletionInfo.json');
}
