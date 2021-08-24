import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvisChip from "@app/model/stc/StcSangvisChip";

export async function updateStcSangvisChip(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5093.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvisChip = stcResult.body.map(row => StcSangvisChip.fromArray(row));
    return writeJson(stcSangvisChip, outputDir, 'SangvisChip.json');
}
