import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvisAdvance from "@app/model/stc/StcSangvisAdvance";

export async function updateStcSangvisAdvance(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5095.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvisAdvance = stcResult.body.map(row => StcSangvisAdvance.fromArray(row));
    return writeJson(stcSangvisAdvance, outputDir, 'SangvisAdvance.json');
}
