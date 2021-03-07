import StcReader from "./StcReader";
import path from "path";
import {writeJson} from "./WriterUtils";
import StcEnemyCharacterType from "../model/stc/StcEnemyCharacterType";

export async function updateStcEnemyCharacterType(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5025.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcEnemyCharacterType = stcResult.body.map(row => StcEnemyCharacterType.fromArray(row));
    return writeJson(stcEnemyCharacterType, outputDir, 'EnemyCharacterType.json');
}
