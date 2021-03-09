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

export class StrategyFairySkill {
    static readonly PARACHUTE_DEBUFF = new StrategyFairySkill('Parachute Fairy debuff', '10086', '9');
    static readonly SUEE_BUFF = new StrategyFairySkill('Suee buff', '1004', '1004');
    static readonly CONSTRUCTION_BUFF = new StrategyFairySkill('Construction Fairy buff', '6', '12');
    static readonly COMBO_BUFF = new StrategyFairySkill('Combo Fairy buff', '1700', '17', 3);

    private constructor(readonly name: string, private readonly buffId: string, private readonly missionSkillConfigId: string, readonly maxStacks = 0) {
    }

    private getMissionSkillConfigId(skillLevel: number) {
        return `${this.missionSkillConfigId}${`${skillLevel}`.padStart(2, '0')}`;
    }

    private strategyFairySkillInfo(skillLevel: number, stack: number): StrategyFairySkillInfo {
        return {
            team_id: 1,
            buff_id: `${Number.parseInt(this.buffId) + stack}`,
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

