import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvisExp from "@app/model/stc/StcSangvisExp";

export async function updateStcSangvisExp(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5105.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvisExp = stcResult.body.map(row => StcSangvisExp.fromArray(row));
    return writeJson(stcSangvisExp, outputDir, 'SangvisExp.json');
}
