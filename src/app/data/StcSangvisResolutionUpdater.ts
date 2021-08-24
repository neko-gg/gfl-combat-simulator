import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvisResolution from "@app/model/stc/StcSangvisResolution";

export async function updateStcSangvisResolution(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5096.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvisResolution = stcResult.body.map(row => StcSangvisResolution.fromArray(row));
    return writeJson(stcSangvisResolution, outputDir, 'SangvisResolution.json');
}
