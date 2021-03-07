export default class StcGun {
    id: number;
    name: string;
    en_name: string;
    code: string;
    introduce: string;
    dialogue: string;
    extra: string;
    en_introduce: string;
    character: string;
    type: number;
    rank: number;
    develop_duration: number;
    baseammo: number;
    basemre: number;
    ammo_add_withnumber: number;
    mre_add_withnumber: number;
    retiremp: number;
    retireammo: number;
    retiremre: number;
    retirepart: number;
    ratio_life: number;
    ratio_pow: number;
    ratio_rate: number;
    ratio_speed: number;
    ratio_hit: number;
    ratio_dodge: number;
    ratio_armor: number;
    armor_piercing: number;
    crit: number;
    special: number;
    eat_ratio: number;
    ratio_range: number;
    skill1: number;
    skill2: number;
    normal_attack: number;
    passive_skill: string;
    dynamic_passive_skill: string;
    effect_grid_center: number;
    effect_guntype: string;
    effect_grid_pos: string;
    effect_grid_effect: string;
    max_equip: number;
    type_equip1: string;
    type_equip2: string;
    type_equip3: string;
    type_equip4: string;
    ai: number;
    is_additional: number;
    launch_time: string;
    obtain_ids: string;
    rank_display: number;
    prize_id: number;
    mindupdate_consume: string;
    explore_tag: string;
    gun_detail_bg: string;
    org_id: number;

    constructor(id: number, name: string, en_name: string, code: string, introduce: string, dialogue: string, extra: string, en_introduce: string, character: string, type: number, rank: number, develop_duration: number, baseammo: number, basemre: number, ammo_add_withnumber: number, mre_add_withnumber: number, retiremp: number, retireammo: number, retiremre: number, retirepart: number, ratio_life: number, ratio_pow: number, ratio_rate: number, ratio_speed: number, ratio_hit: number, ratio_dodge: number, ratio_armor: number, armor_piercing: number, crit: number, special: number, eat_ratio: number, ratio_range: number, skill1: number, skill2: number, normal_attack: number, passive_skill: string, dynamic_passive_skill: string, effect_grid_center: number, effect_guntype: string, effect_grid_pos: string, effect_grid_effect: string, max_equip: number, type_equip1: string, type_equip2: string, type_equip3: string, type_equip4: string, ai: number, is_additional: number, launch_time: string, obtain_ids: string, rank_display: number, prize_id: number, mindupdate_consume: string, explore_tag: string, gun_detail_bg: string, org_id: number) {
        this.id = id;
        this.name = name;
        this.en_name = en_name;
        this.code = code;
        this.introduce = introduce;
        this.dialogue = dialogue;
        this.extra = extra;
        this.en_introduce = en_introduce;
        this.character = character;
        this.type = type;
        this.rank = rank;
        this.develop_duration = develop_duration;
        this.baseammo = baseammo;
        this.basemre = basemre;
        this.ammo_add_withnumber = ammo_add_withnumber;
        this.mre_add_withnumber = mre_add_withnumber;
        this.retiremp = retiremp;
        this.retireammo = retireammo;
        this.retiremre = retiremre;
        this.retirepart = retirepart;
        this.ratio_life = ratio_life;
        this.ratio_pow = ratio_pow;
        this.ratio_rate = ratio_rate;
        this.ratio_speed = ratio_speed;
        this.ratio_hit = ratio_hit;
        this.ratio_dodge = ratio_dodge;
        this.ratio_armor = ratio_armor;
        this.armor_piercing = armor_piercing;
        this.crit = crit;
        this.special = special;
        this.eat_ratio = eat_ratio;
        this.ratio_range = ratio_range;
        this.skill1 = skill1;
        this.skill2 = skill2;
        this.normal_attack = normal_attack;
        this.passive_skill = passive_skill;
        this.dynamic_passive_skill = dynamic_passive_skill;
        this.effect_grid_center = effect_grid_center;
        this.effect_guntype = effect_guntype;
        this.effect_grid_pos = effect_grid_pos;
        this.effect_grid_effect = effect_grid_effect;
        this.max_equip = max_equip;
        this.type_equip1 = type_equip1;
        this.type_equip2 = type_equip2;
        this.type_equip3 = type_equip3;
        this.type_equip4 = type_equip4;
        this.ai = ai;
        this.is_additional = is_additional;
        this.launch_time = launch_time;
        this.obtain_ids = obtain_ids;
        this.rank_display = rank_display;
        this.prize_id = prize_id;
        this.mindupdate_consume = mindupdate_consume;
        this.explore_tag = explore_tag;
        this.gun_detail_bg = gun_detail_bg;
        this.org_id = org_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcGun {
        return new StcGun(array[0] as number,
                          array[1] as string,
                          array[2] as string,
                          array[3] as string,
                          array[4] as string,
                          array[5] as string,
                          array[6] as string,
                          array[7] as string,
                          array[8] as string,
                          array[9] as number,
                          array[10] as number,
                          array[11] as number,
                          array[12] as number,
                          array[13] as number,
                          array[14] as number,
                          array[15] as number,
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
                          array[29] as number,
                          array[30] as number,
                          array[31] as number,
                          array[32] as number,
                          array[33] as number,
                          array[34] as number,
                          array[35] as string,
                          array[36] as string,
                          array[37] as number,
                          array[38] as string,
                          array[39] as string,
                          array[40] as string,
                          array[41] as number,
                          array[42] as string,
                          array[43] as string,
                          array[44] as string,
                          array[45] as string,
                          array[46] as number,
                          array[47] as number,
                          array[48] as string,
                          array[49] as string,
                          array[50] as number,
                          array[51] as number,
                          array[52] as string,
                          array[53] as string,
                          array[54] as string,
                          array[55] as number)
    }

}
