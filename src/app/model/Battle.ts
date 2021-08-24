import HOC from "@app/model/HOC";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";

export interface SpotActInfo {
    spot_id: string;
    team_id: string;
    belong: string;
    if_random: string;
    reinforce_count: string;
    seed: number;
    enemy_team_id: string;
    sangvis_team_id: string;
    boss_hp: string;
    enemy_hp_percent: string;
    enemy_instance_id: string;
    enemy_ai: string;
    enemy_ai_para: string;
    ally_instance_ids: number[];
    squad_instance_ids: number[];
    hostage_id: string;
    hostage_hp: string;
    hostage_max_hp: string;
    enemy_birth_turn: string;
    supply_count: string;
}

function mapSpotActInfo(selectedEchelonType: "griffin" | "coalition", spotIds: number[], hocs: HOC[], hocSpotIds: number[], fightSpotId: number, enemyTeamId: number, nodeBelongsTo: NodeBelongsTo, seed: number): SpotActInfo[] {
    let hocCounter = 0;
    return spotIds.map(spotId => ({
        spot_id: `${spotId}`,
        team_id: `${selectedEchelonType == "griffin" && fightSpotId === spotId ? 1 : 0}`,
        belong: `${fightSpotId === spotId ? nodeBelongsTo : NodeBelongsTo.WHITE}`,
        if_random: "0",
        reinforce_count: "0",
        seed: seed,
        enemy_team_id: `${fightSpotId === spotId ? enemyTeamId : 0}`,
        sangvis_team_id: `${selectedEchelonType == "coalition" && fightSpotId === spotId ? 1 : 0}`,
        boss_hp: "0",
        enemy_hp_percent: "1",
        enemy_instance_id: `${fightSpotId === spotId ? 1 : 0}`,
        enemy_ai: "",
        enemy_ai_para: "",
        ally_instance_ids: [],
        squad_instance_ids: hocSpotIds.includes(spotId) && hocs.length > hocCounter ? [hocs[hocCounter++].id()] : [],
        hostage_id: "0",
        hostage_hp: "0",
        hostage_max_hp: "0",
        enemy_birth_turn: "999",
        supply_count: "0"
    } as SpotActInfo));
}

function getDaySpotActInfo(selectedEchelonType: "griffin" | "coalition", enemyTeamId: number, nodeBelongsTo: NodeBelongsTo, seed: number, hocs: HOC[] = []): SpotActInfo[] {
    const spotIds = [99, 100, 101, 102, 103, 104, 105, 106, 107];
    const hocSpotIds = [99, 100, 101, 102, 104, 105, 106, 107];
    const fightSpotId = 103;

    return mapSpotActInfo(selectedEchelonType, spotIds, hocs, hocSpotIds, fightSpotId, enemyTeamId, nodeBelongsTo, seed);
}

function getNightSpotActInfo(selectedEchelonType: "griffin" | "coalition", enemyTeamId: number, nodeBelongsTo: NodeBelongsTo, seed: number, hocs: HOC[] = []): SpotActInfo[] {
    const spotIds = [1308, 1309, 1310, 1348, 1349, 1350, 1351, 1352, 1353];
    const hocSpotIds = [1308, 1309, 1310, 1348, 1351, 1352, 1353]
    const fightSpotId = 1349;

    return mapSpotActInfo(selectedEchelonType, spotIds, hocs, hocSpotIds, fightSpotId, enemyTeamId, nodeBelongsTo, seed);
}

export function getSpotActInfo(selectedEchelonType: "griffin" | "coalition", isDay: boolean, enemyTeamId: number, nodeBelongsTo: NodeBelongsTo, seed: number, hocs: HOC[] = []): SpotActInfo[] {
    return isDay ? getDaySpotActInfo(selectedEchelonType, enemyTeamId, nodeBelongsTo, seed, hocs) : getNightSpotActInfo(selectedEchelonType, enemyTeamId, nodeBelongsTo, seed, hocs);
}
