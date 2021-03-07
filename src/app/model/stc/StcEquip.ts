export default class StcEquip {
    id: number;
    name: string;
    description: string;
    rank: number;
    category: number;
    type: number;
    pow: string;
    hit: string;
    dodge: string;
    speed: string;
    rate: string;
    critical_harm_rate: string;
    critical_percent: string;
    armor_piercing: string;
    armor: string;
    shield: string;
    damage_amplify: string;
    damage_reduction: string;
    night_view_percent: string;
    bullet_number_up: string;
    skill_effect_per: number;
    skill_effect: number;
    slow_down_percent: number;
    slow_down_rate: number;
    slow_down_time: number;
    dot_percent: number;
    dot_damage: number;
    dot_time: number;
    retire_mp: number;
    retire_ammo: number;
    retire_mre: number;
    retire_part: number;
    code: string;
    develop_duration: number;
    company: string;
    skill_level_up: number;
    fit_guns: string;
    equip_introduction: string;
    powerup_mp: number;
    powerup_ammo: number;
    powerup_mre: number;
    powerup_part: number;
    exclusive_rate: number;
    bonus_type: string;
    skill: number;
    passive_skill: number;
    max_level: number;
    auto_select_id: number;
    equip_group_id: number;


    constructor(id: number, name: string, description: string, rank: number, category: number, type: number, pow: string, hit: string, dodge: string, speed: string, rate: string, critical_harm_rate: string, critical_percent: string, armor_piercing: string, armor: string, shield: string, damage_amplify: string, damage_reduction: string, night_view_percent: string, bullet_number_up: string, skill_effect_per: number, skill_effect: number, slow_down_percent: number, slow_down_rate: number, slow_down_time: number, dot_percent: number, dot_damage: number, dot_time: number, retire_mp: number, retire_ammo: number, retire_mre: number, retire_part: number, code: string, develop_duration: number, company: string, skill_level_up: number, fit_guns: string, equip_introduction: string, powerup_mp: number, powerup_ammo: number, powerup_mre: number, powerup_part: number, exclusive_rate: number, bonus_type: string, skill: number, passive_skill: number, max_level: number, auto_select_id: number, equip_group_id: number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.rank = rank;
        this.category = category;
        this.type = type;
        this.pow = pow;
        this.hit = hit;
        this.dodge = dodge;
        this.speed = speed;
        this.rate = rate;
        this.critical_harm_rate = critical_harm_rate;
        this.critical_percent = critical_percent;
        this.armor_piercing = armor_piercing;
        this.armor = armor;
        this.shield = shield;
        this.damage_amplify = damage_amplify;
        this.damage_reduction = damage_reduction;
        this.night_view_percent = night_view_percent;
        this.bullet_number_up = bullet_number_up;
        this.skill_effect_per = skill_effect_per;
        this.skill_effect = skill_effect;
        this.slow_down_percent = slow_down_percent;
        this.slow_down_rate = slow_down_rate;
        this.slow_down_time = slow_down_time;
        this.dot_percent = dot_percent;
        this.dot_damage = dot_damage;
        this.dot_time = dot_time;
        this.retire_mp = retire_mp;
        this.retire_ammo = retire_ammo;
        this.retire_mre = retire_mre;
        this.retire_part = retire_part;
        this.code = code;
        this.develop_duration = develop_duration;
        this.company = company;
        this.skill_level_up = skill_level_up;
        this.fit_guns = fit_guns;
        this.equip_introduction = equip_introduction;
        this.powerup_mp = powerup_mp;
        this.powerup_ammo = powerup_ammo;
        this.powerup_mre = powerup_mre;
        this.powerup_part = powerup_part;
        this.exclusive_rate = exclusive_rate;
        this.bonus_type = bonus_type;
        this.skill = skill;
        this.passive_skill = passive_skill;
        this.max_level = max_level;
        this.auto_select_id = auto_select_id;
        this.equip_group_id = equip_group_id;
    }


    static fromArray(array: (number | bigint | string)[]): StcEquip {
        return new StcEquip(array[0] as number,
                            array[1] as string,
                            array[2] as string,
                            array[3] as number,
                            array[4] as number,
                            array[5] as number,
                            array[6] as string,
                            array[7] as string,
                            array[8] as string,
                            array[9] as string,
                            array[10] as string,
                            array[11] as string,
                            array[12] as string,
                            array[13] as string,
                            array[14] as string,
                            array[15] as string,
                            array[16] as string,
                            array[17] as string,
                            array[18] as string,
                            array[19] as string,
                            array[20] as number,
                            array[21] as number,
                            array[22] as number,
                            array[23] as number,
                            array[24] as number,
                            array[25] as number,
                            array[26] as number,
                            array[27] as number,
                            array[28] as number,
                            array[29] as number,
                            array[30] as number,
                            array[31] as number,
                            array[32] as string,
                            array[33] as number,
                            array[34] as string,
                            array[35] as number,
                            array[36] as string,
                            array[37] as string,
                            array[38] as number,
                            array[39] as number,
                            array[40] as number,
                            array[41] as number,
                            array[42] as number,
                            array[43] as string,
                            array[44] as number,
                            array[45] as number,
                            array[46] as number,
                            array[47] as number,
                            array[48] as number)
    }

}
