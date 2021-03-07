import enemyInTeam from "@static/stc/EnemyInTeam.json";
import enemyTeam from "@static/stc/EnemyTeam.json";
import enemyCharacterType from "@static/stc/EnemyCharacterType.json";
import EnemyCharacterType from "@app/model/EnemyCharacterType";

export interface EnemyInTeam {
    id: number;
    enemy_team_id: number;
    enemy_character_type_id: number;
    coordinator_x: number;
    coordinator_y: number;
    level: number;
    number: number;
    is_advance: number;
    def_percent: number;
}

export const enemyTeams = enemyTeam.reduce((accumulator, enemyTeam) => {
    if (enemyTeam['enemy_leader']) {
        accumulator[enemyTeam['id']] = enemyTeam;
    }
    return accumulator;
}, []);

export const enemyCharacterTypes: EnemyCharacterType[] = (enemyCharacterType as EnemyCharacterType[]).map(enemyCharacterType => {
    const newEnemyCharacterType = new EnemyCharacterType();
    Object.assign(newEnemyCharacterType, enemyCharacterType);
    return newEnemyCharacterType;
}).reduce((accumulator, enemyCharacterType) => {
    accumulator[enemyCharacterType.id] = enemyCharacterType;
    return accumulator;
}, [])

export const enemyInTeams = (enemyInTeam as EnemyInTeam[]).reduce((accumulator: [], enemyInTeam: EnemyInTeam) => {
    if (enemyCharacterTypes[enemyInTeam.enemy_character_type_id] && enemyTeams[enemyInTeam.enemy_team_id]) {
        ((accumulator[enemyInTeam.enemy_team_id] = accumulator[enemyInTeam.enemy_team_id] || []) as EnemyInTeam[]).push(enemyInTeam);
    }
    return accumulator;
}, []);
