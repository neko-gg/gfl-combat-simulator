import squadInfo from "@static/stc/SquadInfo.json";
import squadStandardAttributionInfo from "@static/stc/SquadStandardAttributionInfo.json";
import squadRankInfo from "@static/stc/SquadRankInfo.json";
import squadTypeInfo from "@static/stc/SquadTypeInfo.json";
import squadCpuCompletionInfo from "@static/stc/SquadCpuCompletionInfo.json";
import squadCpuInfo from "@static/stc/SquadCpuInfo.json";
import squadGridInfo from "@static/stc/SquadGridInfo.json";
import squadAdvancedBonusInfo from "@static/stc/SquadAdvancedBonusInfo.json";
import squadExpInfo from "@static/stc/SquadExpInfo.json";
import StcSquad from "@app/model/stc/StcSquad";
import StcSquadStandardAttribution from "@app/model/stc/StcSquadStandardAttribution";
import StcSquadRank from "@app/model/stc/StcSquadRank";
import StcSquadType from "@app/model/stc/StcSquadType";
import gameConfigInfo from "@static/stc/catchdata/game_config_info.json"
import {ceil} from "@app/utils/math";
import StcSquadCpuCompletion from "@app/model/stc/StcSquadCpuCompletion";
import StcSquadCpu from "@app/model/stc/StcSquadCpu";
import StcSquadGrid from "@app/model/stc/StcSquadGrid";
import StcSquadAdvancedBonus from "@app/model/stc/StcSquadAdvancedBonus";
import fs from "fs";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";
import StcSquadExp from "@app/model/stc/StcSquadExp";

export interface HOCAssistStats {
    lethality: number;
    pierce: number;
    precision: number;
    reload: number;
}

export interface HOCSameColorBonusStats {
    tiles: number;
    assistStats: HOCAssistStats;
}

export enum HOCRarity {
    ONE_STAR = 1,
    TWO_STARS,
    THREE_STARS,
    FOUR_STARS,
    FIVE_STARS
}

enum HOCAssistAttribute {
    LETHALITY = 'assist_damage',
    PIERCE = 'assist_def_break',
    PRECISION = 'assist_hit',
    RELOAD = 'assist_reload'
}

export interface SquadWithUserInfo {
    [id: string]: {
        id: string;
        squad_id: string;
        squad_exp: string;
        squad_level: string;
        rank: string;
        advanced_level: string;
        life: string;
        cur_def: string;
        ammo: string;
        mre: string;
        assist_damage: string;
        assist_reload: string;
        assist_hit: string;
        assist_def_break: string;
        damage: string;
        atk_speed: string;
        hit: string;
        def: string;
        skill1: string;
        skill2: string;
        skill3: string;
    }
}

export interface SquadInfoInMission {
    [squad_instance_id: string]: {
        squad_instance_id: number;
        squad_id: number;
        belong: number;
        battleskill_switch: number;
        attack_next_turn: number;
        against_force_life: number;
    }
}

export default class HOC {
    private readonly idOffset = 666900;
    private readonly squadTypeInfo: StcSquadType;
    private _level = 100;
    private _rarity = HOCRarity.FIVE_STARS;
    private _iteration = 10;
    private _currentStats: HOCAssistStats;
    private _skillOne = 10;
    private _skillTwo = 10;
    private _skillThree = 10;

    constructor(private readonly squadInfo: StcSquad) {
        this.squadTypeInfo = squadTypeInfos[squadInfo.type];
        this.currentStats = this.maxStats();
    }

    static clone(other: HOC): HOC {
        return new HOC(other.squadInfo);
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = Math.max(1, Math.min(maxLevel, value));
        this.iteration = this._iteration;
        this.currentStats = this._currentStats;
    }

    get rarity(): HOCRarity {
        return this._rarity;
    }

    set rarity(value: HOCRarity) {
        this._rarity = value;
        this.iteration = this._iteration;
        this.currentStats = this._currentStats;
    }

    get iteration(): number {
        return this._iteration;
    }

    set iteration(value: number) {
        this._iteration = this.rarity < HOCRarity.FIVE_STARS ? 0 : Math.max(0, Math.min(this.maxIteration(), value));
        this.currentStats = this._currentStats;
    }

    get currentStats(): HOCAssistStats {
        return this._currentStats;
    }

    set currentStats(value: HOCAssistStats) {
        const baseStats = this.baseStats();
        const maxStats = this.maxStats();

        this._currentStats = {
            lethality: Math.max(baseStats.lethality, Math.min(maxStats.lethality, value.lethality)),
            pierce: Math.max(baseStats.pierce, Math.min(maxStats.pierce, value.pierce)),
            precision: Math.max(baseStats.precision, Math.min(maxStats.precision, value.precision)),
            reload: Math.max(baseStats.reload, Math.min(maxStats.reload, value.reload))
        };
    }

    get skillOne(): number {
        return this._skillOne;
    }

    set skillOne(value: number) {
        this._skillOne = Math.max(1, Math.min(10, value));
    }

    get skillTwo(): number {
        return this._skillTwo;
    }

    set skillTwo(value: number) {
        this._skillTwo = Math.max(1, Math.min(10, value));
    }

    get skillThree(): number {
        return this._skillThree;
    }

    set skillThree(value: number) {
        this._skillThree = Math.max(1, Math.min(10, value));
    }

    id(): number {
        return this.squadInfo.id;
    }

    uniqueId(): number {
        return this.id() + this.idOffset;
    }

    name(): string {
        return squadAssets[this.squadInfo.en_name] || squadAssets[this.squadInfo.name];
    }

    range(): number {
        return Number.parseInt(this.squadInfo.battle_assist_range.split(',').slice(-1)[0]);
    }

    stats(level: number): HOCAssistStats {
        const squadBasicRate = this.squadInfo.basic_rate;
        const squadStandardBasicRate = (assistAttribute: HOCAssistAttribute) => squadStandardAttributionInfos[assistAttribute].basic_rate;

        const baseStat = (assistAttribute: HOCAssistAttribute) => ceil((squadBasicRate * (squadStandardBasicRate(assistAttribute) * ((basicLevel + level - 1) * this.attributeCalculation(assistAttribute)))) / 100_000_000);

        return {
            lethality: baseStat(HOCAssistAttribute.LETHALITY),
            pierce: baseStat(HOCAssistAttribute.PIERCE),
            precision: baseStat(HOCAssistAttribute.PRECISION),
            reload: baseStat(HOCAssistAttribute.RELOAD)
        };
    }

    exp(): number {
        return squadExpInfos[this.level].exp;
    }

    baseStats(): HOCAssistStats {
        return this.stats(1);
    }

    leveledStats(): HOCAssistStats {
        return this.stats(this.level);
    }

    iterationStats(): HOCAssistStats {
        if (this.iteration <= 0) return emptyHOCAssistStats();

        const mapSquadAdvancedBonusInfoHOCAssistStats = (squadAdvancedBonusInfo: StcSquadAdvancedBonus) => ({
            lethality: squadAdvancedBonusInfo[HOCAssistAttribute.LETHALITY],
            pierce: squadAdvancedBonusInfo[HOCAssistAttribute.PIERCE],
            precision: squadAdvancedBonusInfo[HOCAssistAttribute.PRECISION],
            reload: squadAdvancedBonusInfo[HOCAssistAttribute.RELOAD]
        });

        const squadAdvancedBonusInfo = [...squadAdvancedBonusInfos[this.squadInfo.advanced_bonus]].find(squadAdvancedBonusInfo => squadAdvancedBonusInfo.lv === this.iteration);
        return mapSquadAdvancedBonusInfoHOCAssistStats(squadAdvancedBonusInfo);
    }

    maxIteration(): number {
        return this.rarity < HOCRarity.FIVE_STARS || this.level < 100 ? 0 : 10;
    }

    circuitBoardMaxStats(): HOCAssistStats {
        const squadCpuRate = this.squadInfo.cpu_rate;
        const squadStandardCpuRate = (assistAttribute: HOCAssistAttribute) => squadStandardAttributionInfos[assistAttribute].cpu_rate;
        const squadRankCpuRate = squadRankInfos[this.rarity].cpu_rate;

        const circuitBoardStat = (assistAttribute: HOCAssistAttribute) => ceil(((squadCpuRate * (squadStandardCpuRate(assistAttribute) * (this.attributeCalculation(assistAttribute) * (basicLevel + this.level - 1)))) * squadRankCpuRate) / 10_000_000_000)

        return {
            lethality: circuitBoardStat(HOCAssistAttribute.LETHALITY),
            pierce: circuitBoardStat(HOCAssistAttribute.PIERCE),
            precision: circuitBoardStat(HOCAssistAttribute.PRECISION),
            reload: circuitBoardStat(HOCAssistAttribute.RELOAD)
        };
    }

    sameColorBonusStats(): HOCSameColorBonusStats[] {
        const cpuId = this.squadInfo.cpu_id;
        const groupId = this.squadInfo.advanced_bonus;
        const gridKey = `grid${this.rarity}` as keyof StcSquadCpu;
        const gridId = squadCpuInfos[cpuId][gridKey];
        const maxTiles = squadGridInfos[gridId].grid_number;

        const cpuCompletionInfos = [...squadCpuCompletionInfos[groupId]].filter(squadCpuCompletionInfo => squadCpuCompletionInfo.unlock_number <= maxTiles);

        const mapSquadCpuCompletionInfoHOCSameColorBonusStats = (squadCpuCompletionInfo: StcSquadCpuCompletion) => ({
            tiles: squadCpuCompletionInfo.unlock_number,
            assistStats: {
                lethality: squadCpuCompletionInfo[HOCAssistAttribute.LETHALITY],
                pierce: squadCpuCompletionInfo[HOCAssistAttribute.PIERCE],
                precision: squadCpuCompletionInfo[HOCAssistAttribute.PRECISION],
                reload: squadCpuCompletionInfo[HOCAssistAttribute.RELOAD]
            }
        });

        const emptyHOCSameColorBonusStats = () => ({
            tiles: 0,
            assistStats: emptyHOCAssistStats()
        });

        const sumHOCSameColorBonusStats = (bonusStatsOne: HOCSameColorBonusStats, bonusStatsTwo: HOCSameColorBonusStats) => {
            Object.keys(bonusStatsOne.assistStats)
                  .forEach((assistStat: keyof HOCAssistStats) => bonusStatsOne.assistStats[assistStat] += bonusStatsTwo.assistStats[assistStat]);
            bonusStatsOne.tiles = Math.max(bonusStatsOne.tiles, bonusStatsTwo.tiles);
            return bonusStatsOne;
        };

        return cpuCompletionInfos.map(squadCpuCompletionInfo => [...cpuCompletionInfos].filter(cpuCompletionInfo => cpuCompletionInfo.lv <= squadCpuCompletionInfo.lv)
                                                                                       .map(cpuCompletionInfo => mapSquadCpuCompletionInfoHOCSameColorBonusStats(cpuCompletionInfo))
                                                                                       .reduce((accumulator: HOCSameColorBonusStats, current: HOCSameColorBonusStats) => sumHOCSameColorBonusStats(accumulator, current), emptyHOCSameColorBonusStats()));
    }

    maxStats(): HOCAssistStats {
        const sumAssistStats = (assistStatsOne: HOCAssistStats, assistStatsTwo: HOCAssistStats) => {
            Object.keys(assistStatsOne)
                  .forEach((assistStat: keyof HOCAssistStats) => assistStatsOne[assistStat] += assistStatsTwo[assistStat]);
            return assistStatsOne;
        };

        return [this.leveledStats(),
                this.iterationStats(),
                this.circuitBoardMaxStats(),
                this.sameColorBonusStats().slice(-1)[0].assistStats].reduce((a, b) => sumAssistStats(a, b));
    }

    deltaStats(): HOCAssistStats {
        const baseStats = this.baseStats();
        const deltaStats: HOCAssistStats = emptyHOCAssistStats();
        Object.assign(deltaStats, this._currentStats);
        Object.keys(deltaStats)
              .forEach((assistStat: keyof HOCAssistStats) => deltaStats[assistStat] -= baseStats[assistStat]);

        return deltaStats;
    }

    squadWithUserInfo(): SquadWithUserInfo {
        const id = this.squadInfo.id;
        const uniqueId = `${this.uniqueId()}`
        const deltaStats = this.deltaStats();

        return {
            [uniqueId]: {
                "id": uniqueId,
                "squad_id": `${id}`,
                "squad_exp": `${this.exp()}`,
                "squad_level": `${this.level}`,
                "rank": `${this.rarity}`,
                "advanced_level": `${this.iteration}`,
                "life": "500",
                "cur_def": "0",
                "ammo": "10",
                "mre": "10",
                "assist_damage": `${deltaStats.lethality}`,
                "assist_reload": `${deltaStats.reload}`,
                "assist_hit": `${deltaStats.precision}`,
                "assist_def_break": `${deltaStats.pierce}`,
                "damage": "0",
                "atk_speed": "0",
                "hit": "0",
                "def": "0",
                "skill1": `${this.skillOne}`,
                "skill2": `${this.skillTwo}`,
                "skill3": `${this.skillThree}`
            }
        }
    }

    squadInfoInMission(): SquadInfoInMission {
        const id = this.squadInfo.id;
        const uniqueId = this.uniqueId();

        return {
            [`${id}`]: {
                squad_instance_id: id,
                squad_id: uniqueId,
                belong: 1,
                battleskill_switch: 1,
                attack_next_turn: 1,
                against_force_life: 0
            }
        }
    }

    private attributeCalculation(assistAttribute: HOCAssistAttribute): number {
        const squadAttribute = this.squadInfo[assistAttribute];
        const squadTypeAttribute = this.squadTypeInfo[assistAttribute];
        const squadStandardAttribute = squadStandardAttributionInfos[assistAttribute].standard_attribute;
        return squadAttribute * squadTypeAttribute * squadStandardAttribute;
    }
}

const basicLevel = Number.parseInt(gameConfigInfo.find(gameConfig => 'squad_basic_lv' === gameConfig.parameter_name).parameter_value);
const maxLevel = Number.parseInt(gameConfigInfo.find(gameConfig => 'squad_lv_max' === gameConfig.parameter_name).parameter_value);

const emptyHOCAssistStats = () => ({
    lethality: 0,
    pierce: 0,
    precision: 0,
    reload: 0
});

const squadStandardAttributionInfos = squadStandardAttributionInfo.reduce((accumulator: { [key in string]: StcSquadStandardAttribution }, current: StcSquadStandardAttribution) => {
    accumulator[current.attribute_type] = current;
    return accumulator;
}, {});

const squadRankInfos = squadRankInfo.reduce((accumulator: StcSquadRank[], current: StcSquadRank) => {
    accumulator[current.star_id] = current;
    return accumulator;
}, []);

const squadTypeInfos = squadTypeInfo.reduce((accumulator: StcSquadType[], current: StcSquadType) => {
    accumulator[current.type_id] = current;
    return accumulator;
}, []);

const squadCpuCompletionInfos = squadCpuCompletionInfo.reduce((accumulator: StcSquadCpuCompletion[][], current: StcSquadCpuCompletion) => {
    accumulator[current.group_id] = accumulator[current.group_id] || [];
    accumulator[current.group_id].push(current);
    return accumulator;
}, []);

const squadCpuInfos = squadCpuInfo.reduce((accumulator: StcSquadCpu[], current: StcSquadCpu) => {
    accumulator[current.id] = current;
    return accumulator;
}, []);

const squadGridInfos = squadGridInfo.reduce((accumulator: StcSquadGrid[], current: StcSquadGrid) => {
    accumulator[current.id] = current;
    return accumulator;
}, []);

const squadAdvancedBonusInfos = squadAdvancedBonusInfo.reduce((accumulator: StcSquadAdvancedBonus[][], current: StcSquadAdvancedBonus) => {
    accumulator[current.group_id] = accumulator[current.group_id] || [];
    accumulator[current.group_id].push(current);
    return accumulator;
}, []);

const squadExpInfos = squadExpInfo.reduce((accumulator: StcSquadExp[], current: StcSquadExp) => {
    accumulator[current.lv] = current;
    return accumulator;
}, []);

const squadInfos = squadInfo.filter(squad => squadCpuCompletionInfos[squad.id])
                            .reduce((accumulator: StcSquad[], current: StcSquad) => {
    accumulator[current.id] = current;
    return accumulator;
}, []);

const squadAssets = fs.readFileSync(getStaticPath(path.join('asset', 'text', 'squad.txt')))
                      .toString()
                      .split('\n')
                      .map(assetLine => assetLine?.split(','))
                      .reduce((accumulator: { [key in string]: string }, current: string[]) => {
                          accumulator[current[0]] = current.slice(1).join(',');
                          return accumulator;
                      }, {});

export const HOCs = squadInfos.map(squadInfo => new HOC(squadInfo));

const enemyHOCIdOffset = 1_000;
export const alliedHOCs = [...HOCs].filter(hoc => hoc).filter(hoc => hoc.id() <= enemyHOCIdOffset);
export const enemyHOCs = [...HOCs].filter(hoc => hoc).filter(hoc => hoc.id() > enemyHOCIdOffset);
