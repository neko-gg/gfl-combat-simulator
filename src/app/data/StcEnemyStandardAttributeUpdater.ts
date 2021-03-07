import StcReader from "./StcReader";
import path from "path";
import {writeJson} from "./WriterUtils";
import StcEnemyStandardAttribute from "../model/stc/StcEnemyStandardAttribute";

export async function updateStcEnemyStandardAttribute(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5026.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcEnemyStandardAttribute = stcResult.body.map(row => StcEnemyStandardAttribute.fromArray(row));
    return writeJson(stcEnemyStandardAttribute, outputDir, 'EnemyStandardAttribute.json');
}
