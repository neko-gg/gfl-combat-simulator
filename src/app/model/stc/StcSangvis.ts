export default class StcSangvis {
    id: number;
    name: string;
    en_name: string;
    code: string;
    introduce: string;
    dialogue: string;
    extra: string;
    en_introduce: string;
    forces: number;
    type: number;
    character: string;
    formation: number;
    resolution: number;
    shape_scale: string;
    ap_cost: number;
    ap_add: number;
    rank: number;
    skill1: number;
    skill2_type: number;
    skill2: number;
    skill3: number;
    skill_advance: number;
    skill_resolution: string;
    passive_skill2: string;
    dynamic_passive_skill: string;
    normal_attack: number;
    baseammo: number;
    basemre: number;
    ammo_add_withnumber: number;
    mre_add_withnumber: number;
    ratio_hp: number;
    ratio_pow: number;
    ratio_rate: number;
    ratio_hit: number;
    ratio_dodge: number;
    ratio_armor: number;
    armor_piercing: number;
    crit: number;
    crit_dmg: number;
    eat_ratio: number;
    ratio_speed: number;
    special: number;
    attack_range_type: number;
    assist_attack_range: number;
    ratio_range: number;
    search_range: number;
    effect_grid_effect: string;
    type_chip1: string;
    type_chip2: string;
    type_chip3: string;
    illustration_id: number;
    ai: number;
    is_additional: number;
    launch_time: string;
    obtain_ids: string;
    display_enemy_team: number;
    picture_offset: string;
    picture_scale: string;
    dorm_scale: number;
    org_id: number;

    constructor(id: number, name: string, en_name: string, code: string, introduce: string, dialogue: string, extra: string, en_introduce: string, forces: number, type: number, character: string, formation: number, resolution: number, shape_scale: string, ap_cost: number, ap_add: number, rank: number, skill1: number, skill2_type: number, skill2: number, skill3: number, skill_advance: number, skill_resolution: string, passive_skill2: string, dynamic_passive_skill: string, normal_attack: number, baseammo: number, basemre: number, ammo_add_withnumber: number, mre_add_withnumber: number, ratio_hp: number, ratio_pow: number, ratio_rate: number, ratio_hit: number, ratio_dodge: number, ratio_armor: number, armor_piercing: number, crit: number, crit_dmg: number, eat_ratio: number, ratio_speed: number, special: number, attack_range_type: number, assist_attack_range: number, ratio_range: number, search_range: number, effect_grid_effect: string, type_chip1: string, type_chip2: string, type_chip3: string, illustration_id: number, ai: number, is_additional: number, launch_time: string, obtain_ids: string, display_enemy_team: number, picture_offset: string, picture_scale: string, dorm_scale: number, org_id: number) {
        this.id = id;
        this.name = name;
        this.en_name = en_name;
        this.code = code;
        this.introduce = introduce;
        this.dialogue = dialogue;
        this.extra = extra;
        this.en_introduce = en_introduce;
        this.forces = forces;
        this.type = type;
        this.character = character;
        this.formation = formation;
        this.resolution = resolution;
        this.shape_scale = shape_scale;
        this.ap_cost = ap_cost;
        this.ap_add = ap_add;
        this.rank = rank;
        this.skill1 = skill1;
        this.skill2_type = skill2_type;
        this.skill2 = skill2;
        this.skill3 = skill3;
        this.skill_advance = skill_advance;
        this.skill_resolution = skill_resolution;
        this.passive_skill2 = passive_skill2;
        this.dynamic_passive_skill = dynamic_passive_skill;
        this.normal_attack = normal_attack;
        this.baseammo = baseammo;
        this.basemre = basemre;
        this.ammo_add_withnumber = ammo_add_withnumber;
        this.mre_add_withnumber = mre_add_withnumber;
        this.ratio_hp = ratio_hp;
        this.ratio_pow = ratio_pow;
        this.ratio_rate = ratio_rate;
        this.ratio_hit = ratio_hit;
        this.ratio_dodge = ratio_dodge;
        this.ratio_armor = ratio_armor;
        this.armor_piercing = armor_piercing;
        this.crit = crit;
        this.crit_dmg = crit_dmg;
        this.eat_ratio = eat_ratio;
        this.ratio_speed = ratio_speed;
        this.special = special;
        this.attack_range_type = attack_range_type;
        this.assist_attack_range = assist_attack_range;
        this.ratio_range = ratio_range;
        this.search_range = search_range;
        this.effect_grid_effect = effect_grid_effect;
        this.type_chip1 = type_chip1;
        this.type_chip2 = type_chip2;
        this.type_chip3 = type_chip3;
        this.illustration_id = illustration_id;
        this.ai = ai;
        this.is_additional = is_additional;
        this.launch_time = launch_time;
        this.obtain_ids = obtain_ids;
        this.display_enemy_team = display_enemy_team;
        this.picture_offset = picture_offset;
        this.picture_scale = picture_scale;
        this.dorm_scale = dorm_scale;
        this.org_id = org_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvis {
        return new StcSangvis(array[0] as number,
                              array[1] as string,
                              array[2] as string,
                              array[3] as string,
                              array[4] as string,
                              array[5] as string,
                              array[6] as string,
                              array[7] as string,
                              array[8] as number,
                              array[9] as number,
                              array[10] as string,
                              array[11] as number,
                              array[12] as number,
                              array[13] as string,
                              array[14] as number,
                              array[15] as number,
                              array[16] as number,
                              array[17] as number,
                              array[18] as number,
                              array[19] as number,
                              array[20] as number,
                              array[21] as number,
                              array[22] as string,
                              array[23] as string,
                              array[24] as string,
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
                              array[35] as number,
                              array[36] as number,
                              array[37] as number,
                              array[38] as number,
                              array[39] as number,
                              array[40] as number,
                              array[41] as number,
                              array[42] as number,
                              array[43] as number,
                              array[44] as number,
                              array[45] as number,
                              array[46] as string,
                              array[47] as string,
                              array[48] as string,
                              array[49] as string,
                              array[50] as number,
                              array[51] as number,
                              array[52] as number,
                              array[53] as string,
                              array[54] as string,
                              array[55] as number,
                              array[56] as string,
                              array[57] as string,
                              array[58] as number,
                              array[59] as number)
    }

}
