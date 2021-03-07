import StcReader from "./StcReader";
import path from "path";
import {writeJson} from "./WriterUtils";
import StcFairy from "../model/stc/StcFairy";

export async function updateStcFairy(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5115.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcFairies = stcResult.body.map(row => StcFairy.fromArray(row));
    return writeJson(stcFairies, outputDir, 'FairyInfo.json');
}

