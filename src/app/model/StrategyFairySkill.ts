export interface StrategyFairySkillInfo {
    "team_id": number,
    "buff_id": string,
    "source_type": number,
    "source_value": number,
    "start_turn": string,
    "battle_count": number,
    "battle_finish_count": number,
    "person_move_count": number,
    "mission_skill_config_id": string
}

export interface StrategyFairySkillInfoPacket {
    [key: string]: { [key in string]: StrategyFairySkillInfo }
}

export abstract class FairySkill {
    readonly name: string;
    readonly buffId: string;
    readonly missionSkillConfigId: string;
    readonly maxStacks: number;
    readonly maxLevel: number;

    constructor(name: string, buffId: string, missionSkillConfigId: string, maxStacks: number, maxLevel: number) {
        this.name = name;
        this.buffId = buffId;
        this.missionSkillConfigId = missionSkillConfigId;
        this.maxStacks = maxStacks;
        this.maxLevel = maxLevel;
    }

    getMissionSkillConfigId(skillLevel: number): string {
        return `${this.missionSkillConfigId}`;
    }

    getBuffId(stack: number): string {
        return `${Number.parseInt(this.buffId)}`;
    }

    strategyFairySkillInfo(skillLevel: number, stack: number): StrategyFairySkillInfo {
        return {
            team_id: 1,
            buff_id: this.getBuffId(stack),
            source_type: 1,
            source_value: 1,
            start_turn: '1',
            battle_count: 1,
            battle_finish_count: 0,
            person_move_count: 0,
            mission_skill_config_id: this.getMissionSkillConfigId(skillLevel)
        }
    }

    getStrategyFairySkillWithIndex(skillLevel: number, stacks?: number): StrategyFairySkillInfo[] {
        return [...Array(stacks || 1).keys()].map(i => this.strategyFairySkillInfo(skillLevel, i));
    }
}

export class StrategyFairySkill extends FairySkill {
    static readonly PARACHUTE_DEBUFF = new StrategyFairySkill('Parachute Fairy debuff', '10086', '9');
    static readonly SUEE_BUFF = new StrategyFairySkill('Suee  buff', '1004', '1004');
    static readonly CONSTRUCTION_BUFF = new StrategyFairySkill('Construction Fairy buff', '6', '12');
    static readonly COMBO_BUFF = new StrategyFairySkill('Combo Fairy buff', '1700', '17', 3);

    private constructor(readonly name: string,
                        readonly buffId: string,
                        readonly missionSkillConfigId: string,
                        readonly maxStacks = 0) {
        super(name, buffId, missionSkillConfigId, maxStacks, 10);
    }

    getMissionSkillConfigId(skillLevel: number): string {
        return `${this.missionSkillConfigId}${`${skillLevel}`.padStart(2, '0')}`;
    }

    getBuffId(stack: number): string {
        return `${Number.parseInt(this.buffId) + stack}`;
    }
}

export class EnemyFairySkill extends FairySkill {
    static readonly EMP = new EnemyFairySkill('EMP debuff', '1000001', '8120725');

    private constructor(readonly name: string,
                        readonly buffId: string,
                        readonly missionSkillConfigId: string) {
        super(name, buffId, missionSkillConfigId, 0, 0);
    }
}

