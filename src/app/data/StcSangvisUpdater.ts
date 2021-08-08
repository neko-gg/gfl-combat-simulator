import path from "path";
import StcReader from "@app/data/StcReader";
import {writeJson} from "@app/data/WriterUtils";
import StcSangvis from "@app/model/stc/StcSangvis";

export async function updateStcSangvis(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5094.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcSangvis = stcResult.body.map(row => StcSangvis.fromArray(row));
    return writeJson(stcSangvis, outputDir, 'Sangvis.json');
}
