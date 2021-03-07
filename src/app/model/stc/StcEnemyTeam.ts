export default class StcEnemyTeam {
    id: number;
    reward_gun_pool: string;
    equip_s_probability: string;
    draw_event_s_id: number;
    enemy_leader: number;
    if_stay: string;
    correction_belong: string;
    correction_turn: string;
    limit_guns: string;
    limit_equips: number;
    ai: string;
    ai_content: string;
    enemy_type_display: string;
    use_building: string;
    use_building_skill: string;
    team_confrontfun_pic: string;
    team_confrontfun_des: number;

    constructor(id: number, reward_gun_pool: string, equip_s_probability: string, draw_event_s_id: number, enemy_leader: number, if_stay: string, correction_belong: string, correction_turn: string, limit_guns: string, limit_equips: number, ai: string, ai_content: string, enemy_type_display: string, use_building: string, use_building_skill: string, team_confrontfun_pic: string, team_confrontfun_des: number) {
        this.id = id;
        this.reward_gun_pool = reward_gun_pool;
        this.equip_s_probability = equip_s_probability;
        this.draw_event_s_id = draw_event_s_id;
        this.enemy_leader = enemy_leader;
        this.if_stay = if_stay;
        this.correction_belong = correction_belong;
        this.correction_turn = correction_turn;
        this.limit_guns = limit_guns;
        this.limit_equips = limit_equips;
        this.ai = ai;
        this.ai_content = ai_content;
        this.enemy_type_display = enemy_type_display;
        this.use_building = use_building;
        this.use_building_skill = use_building_skill;
        this.team_confrontfun_pic = team_confrontfun_pic;
        this.team_confrontfun_des = team_confrontfun_des;
    }

    static fromArray(array: (number | bigint | string)[]): StcEnemyTeam {
        return new StcEnemyTeam(array[0] as number,
                                array[1] as string,
                                array[2] as string,
                                array[3] as number,
                                array[4] as number,
                                array[5] as string,
                                array[6] as string,
                                array[7] as string,
                                array[8] as string,
                                array[9] as number,
                                array[10] as string,
                                array[11] as string,
                                array[12] as string,
                                array[13] as string,
                                array[14] as string,
                                array[15] as string,
                                array[16] as number)
    }

}
