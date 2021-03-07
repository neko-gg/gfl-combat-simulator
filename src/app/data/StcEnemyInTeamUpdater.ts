import StcReader from "./StcReader";
import path from "path";
import {writeJson} from "./WriterUtils";
import StcEnemyInTeam from "../model/stc/StcEnemyInTeam";

export async function updateStcEnemyInTeam(extractDir: string, outputDir: string): Promise<void> {
    const stcPath = path.resolve(extractDir, '5003.stc')
    const stcReader = new StcReader(stcPath);
    const stcResult = await stcReader.readStc();

    const stcEnemyInTeam = stcResult.body.map(row => StcEnemyInTeam.fromArray(row));
    return writeJson(stcEnemyInTeam, outputDir, 'EnemyInTeam.json');
}
