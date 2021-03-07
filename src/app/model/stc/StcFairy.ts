export default class StcFairy {
    id: number;
    name: string;
    code: string;
    description: string;
    introduce: string;
    type: number;
    pow: number;
    hit: number;
    dodge: number;
    armor: number;
    critical_harm_rate: number;
    grow: number;
    proportion: string;
    skill_id: string;
    quality_exp: number;
    quality_need_number: string;
    category: number;
    develop_duration: number;
    retiremp: number;
    retireammo: number;
    retiremre: number;
    retirepart: number;
    powerup_mp: number;
    powerup_ammo: number;
    powerup_mre: number;
    powerup_part: number;
    armor_piercing: number;
    ai: number;
    is_additional: number;
    avatar_offset: string;
    avatar_scale: string;
    picture_offset: string;
    picture_scale: string;
    launch_time: string;
    org_id: number;

    constructor(id: number, name: string, code: string, description: string, introduce: string, type: number, pow: number, hit: number, dodge: number, armor: number, critical_harm_rate: number, grow: number, proportion: string, skill_id: string, quality_exp: number, quality_need_number: string, category: number, develop_duration: number, retiremp: number, retireammo: number, retiremre: number, retirepart: number, powerup_mp: number, powerup_ammo: number, powerup_mre: number, powerup_part: number, armor_piercing: number, ai: number, is_additional: number, avatar_offset: string, avatar_scale: string, picture_offset: string, picture_scale: string, launch_time: string, org_id: number) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.introduce = introduce;
        this.type = type;
        this.pow = pow;
        this.hit = hit;
        this.dodge = dodge;
        this.armor = armor;
        this.critical_harm_rate = critical_harm_rate;
        this.grow = grow;
        this.proportion = proportion;
        this.skill_id = skill_id;
        this.quality_exp = quality_exp;
        this.quality_need_number = quality_need_number;
        this.category = category;
        this.develop_duration = develop_duration;
        this.retiremp = retiremp;
        this.retireammo = retireammo;
        this.retiremre = retiremre;
        this.retirepart = retirepart;
        this.powerup_mp = powerup_mp;
        this.powerup_ammo = powerup_ammo;
        this.powerup_mre = powerup_mre;
        this.powerup_part = powerup_part;
        this.armor_piercing = armor_piercing;
        this.ai = ai;
        this.is_additional = is_additional;
        this.avatar_offset = avatar_offset;
        this.avatar_scale = avatar_scale;
        this.picture_offset = picture_offset;
        this.picture_scale = picture_scale;
        this.launch_time = launch_time;
        this.org_id = org_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcFairy {
        return new StcFairy(array[0] as number,
                          array[1] as string,
                          array[2] as string,
                          array[3] as string,
                          array[4] as string,
                          array[5] as number,
                          array[6] as number,
                          array[7] as number,
                          array[8] as number,
                          array[9] as number,
                          array[10] as number,
                          array[11] as number,
                          array[12] as string,
                          array[13] as string,
                          array[14] as number,
                          array[15] as string,
                          array[16] as number,
                          array[17] as number,
                          array[18] as number,
                          array[19] as number,
                          array[20] as number,
                          array[21] as number,
                          array[22] as number,
                          array[23] as number,
                          array[24] as number,
                          array[25] as number,
                          array[26] as number,
                          array[27] as number,
                          array[28] as number,
                          array[29] as string,
                          array[30] as string,
                          array[31] as string,
                          array[32] as string,
                          array[33] as string,
                          array[34] as number)
    }

}
