import StcReader from "./StcReader";
import StcEnemyTeam from "../model/stc/StcEnemyTeam";
import {writeJson} from "./WriterUtils";
import path from "path";

export async function updateStcEnemyTeam(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5035.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcEnemyTeam = stcResult.body.map(row => StcEnemyTeam.fromArray(row));
    return writeJson(stcEnemyTeam, outputDir, 'EnemyTeam.json');
}
