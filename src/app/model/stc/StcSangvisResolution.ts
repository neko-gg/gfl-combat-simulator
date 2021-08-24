export default class StcSangvisResolution {
    id: number;
    group_id: number;
    lv: number;
    unlock_num: number;
    if_skill_up: number;
    resolution_number: number;
    resolution_hp: number;
    resolution_pow: number;
    resolution_rate: number;
    resolution_hit: number;
    resolution_dodge: number;
    resolution_armor: number;
    resolution_armor_piercing: number;
    resolution_crit: number;
    resolution_crit_dmg: number;
    resolution_speed: number;
    resolution_effect: number;
    effect_grid_effect: string;
    ap_add: number;
    cost_reduce: number;
    skill1: number;
    skill2: number;
    skill3: number;
    skill_advance: number;

    constructor(id: number, group_id: number, lv: number, unlock_num: number, if_skill_up: number, resolution_number: number, resolution_hp: number, resolution_pow: number, resolution_rate: number, resolution_hit: number, resolution_dodge: number, resolution_armor: number, resolution_armor_piercing: number, resolution_crit: number, resolution_crit_dmg: number, resolution_speed: number, resolution_effect: number, effect_grid_effect: string, ap_add: number, cost_reduce: number, skill1: number, skill2: number, skill3: number, skill_advance: number) {
        this.id = id;
        this.group_id = group_id;
        this.lv = lv;
        this.unlock_num = unlock_num;
        this.if_skill_up = if_skill_up;
        this.resolution_number = resolution_number;
        this.resolution_hp = resolution_hp;
        this.resolution_pow = resolution_pow;
        this.resolution_rate = resolution_rate;
        this.resolution_hit = resolution_hit;
        this.resolution_dodge = resolution_dodge;
        this.resolution_armor = resolution_armor;
        this.resolution_armor_piercing = resolution_armor_piercing;
        this.resolution_crit = resolution_crit;
        this.resolution_crit_dmg = resolution_crit_dmg;
        this.resolution_speed = resolution_speed;
        this.resolution_effect = resolution_effect;
        this.effect_grid_effect = effect_grid_effect;
        this.ap_add = ap_add;
        this.cost_reduce = cost_reduce;
        this.skill1 = skill1;
        this.skill2 = skill2;
        this.skill3 = skill3;
        this.skill_advance = skill_advance;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvisResolution {
        return new StcSangvisResolution(array[0] as number,
                                        array[1] as number,
                                        array[2] as number,
                                        array[3] as number,
                                        array[4] as number,
                                        array[5] as number,
                                        array[6] as number,
                                        array[7] as number,
                                        array[8] as number,
                                        array[9] as number,
                                        array[10] as number,
                                        array[11] as number,
                                        array[12] as number,
                                        array[13] as number,
                                        array[14] as number,
                                        array[15] as number,
                                        array[16] as number,
                                        array[17] as string,
                                        array[18] as number,
                                        array[19] as number,
                                        array[20] as number,
                                        array[21] as number,
                                        array[22] as number,
                                        array[23] as number)
    }

}
