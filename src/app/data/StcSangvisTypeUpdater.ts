import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvisType from "@app/model/stc/StcSangvisType";

export async function updateStcSangvisType(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5097.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvisType = stcResult.body.map(row => StcSangvisType.fromArray(row));
    return writeJson(stcSangvisType, outputDir, 'SangvisType.json');
}
