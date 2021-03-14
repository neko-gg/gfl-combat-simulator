import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSquadCpu from "@app/model/stc/StcSquadCpu";

export async function updateStcSquadCpu(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5009.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSquadCpu = stcResult.body.map(row => StcSquadCpu.fromArray(row));
    return writeJson(stcSquadCpu, outputDir, 'SquadCpuInfo.json');
}
