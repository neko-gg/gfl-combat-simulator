export default class StcSquad {
    id: number;
    name: string;
    en_name: string;
    code: string;
    introduce: string;
    dialogue: string;
    extra: string;
    en_introduce: string;
    type: number;
    assist_type: number;
    population: number;
    cpu_id: number;
    hp: number;
    assist_damage: number;
    assist_reload: number;
    assist_hit: number;
    assist_def_break: number;
    damage: number;
    atk_speed: number;
    hit: number;
    basic_rate: number;
    cpu_rate: number;
    crit_rate: number;
    crit_damage: number;
    armor_piercing: number;
    dodge: number;
    move: number;
    assist_armor_piercing: number;
    battle_assist_range: string;
    display_assist_damage_area: number;
    display_assist_area_coef: number;
    attack_range: number;
    night_vision: number;
    skill1: number;
    skill2: number;
    skill3: number;
    performance_skill: number;
    passive_skill: string;
    dynamic_passive_skill: string;
    normal_attack: number;
    advanced_bonus: number;
    deploy_round: number;
    assist_attack_round: number;
    attack_round: number;
    baseammo: number;
    basemre: number;
    ammo_part: number;
    mre_part: number;
    is_additional: number;
    launch_time: string;
    obtain_ids: string;
    piece_item_id: number;
    destroy_coef: number;
    assist_damage_destroy_coef: number;
    mission_skill_repair: string;
    develop_duration: number;
    dorm_ai: string;
    normal_attack_description: number;
    is_show: number;
    org_id: number;

    constructor(id: number, name: string, en_name: string, code: string, introduce: string, dialogue: string, extra: string, en_introduce: string, type: number, assist_type: number, population: number, cpu_id: number, hp: number, assist_damage: number, assist_reload: number, assist_hit: number, assist_def_break: number, damage: number, atk_speed: number, hit: number, basic_rate: number, cpu_rate: number, crit_rate: number, crit_damage: number, armor_piercing: number, dodge: number, move: number, assist_armor_piercing: number, battle_assist_range: string, display_assist_damage_area: number, display_assist_area_coef: number, attack_range: number, night_vision: number, skill1: number, skill2: number, skill3: number, performance_skill: number, passive_skill: string, dynamic_passive_skill: string, normal_attack: number, advanced_bonus: number, deploy_round: number, assist_attack_round: number, attack_round: number, baseammo: number, basemre: number, ammo_part: number, mre_part: number, is_additional: number, launch_time: string, obtain_ids: string, piece_item_id: number, destroy_coef: number, assist_damage_destroy_coef: number, mission_skill_repair: string, develop_duration: number, dorm_ai: string, normal_attack_description: number, is_show: number, org_id: number) {
        this.id = id;
        this.name = name;
        this.en_name = en_name;
        this.code = code;
        this.introduce = introduce;
        this.dialogue = dialogue;
        this.extra = extra;
        this.en_introduce = en_introduce;
        this.type = type;
        this.assist_type = assist_type;
        this.population = population;
        this.cpu_id = cpu_id;
        this.hp = hp;
        this.assist_damage = assist_damage;
        this.assist_reload = assist_reload;
        this.assist_hit = assist_hit;
        this.assist_def_break = assist_def_break;
        this.damage = damage;
        this.atk_speed = atk_speed;
        this.hit = hit;
        this.basic_rate = basic_rate;
        this.cpu_rate = cpu_rate;
        this.crit_rate = crit_rate;
        this.crit_damage = crit_damage;
        this.armor_piercing = armor_piercing;
        this.dodge = dodge;
        this.move = move;
        this.assist_armor_piercing = assist_armor_piercing;
        this.battle_assist_range = battle_assist_range;
        this.display_assist_damage_area = display_assist_damage_area;
        this.display_assist_area_coef = display_assist_area_coef;
        this.attack_range = attack_range;
        this.night_vision = night_vision;
        this.skill1 = skill1;
        this.skill2 = skill2;
        this.skill3 = skill3;
        this.performance_skill = performance_skill;
        this.passive_skill = passive_skill;
        this.dynamic_passive_skill = dynamic_passive_skill;
        this.normal_attack = normal_attack;
        this.advanced_bonus = advanced_bonus;
        this.deploy_round = deploy_round;
        this.assist_attack_round = assist_attack_round;
        this.attack_round = attack_round;
        this.baseammo = baseammo;
        this.basemre = basemre;
        this.ammo_part = ammo_part;
        this.mre_part = mre_part;
        this.is_additional = is_additional;
        this.launch_time = launch_time;
        this.obtain_ids = obtain_ids;
        this.piece_item_id = piece_item_id;
        this.destroy_coef = destroy_coef;
        this.assist_damage_destroy_coef = assist_damage_destroy_coef;
        this.mission_skill_repair = mission_skill_repair;
        this.develop_duration = develop_duration;
        this.dorm_ai = dorm_ai;
        this.normal_attack_description = normal_attack_description;
        this.is_show = is_show;
        this.org_id = org_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquad {
        return new StcSquad(array[0] as number,
                            array[1] as string,
                            array[2] as string,
                            array[3] as string,
                            array[4] as string,
                            array[5] as string,
                            array[6] as string,
                            array[7] as string,
                            array[8] as number,
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
                            array[28] as string,
                            array[29] as number,
                            array[30] as number,
                            array[31] as number,
                            array[32] as number,
                            array[33] as number,
                            array[34] as number,
                            array[35] as number,
                            array[36] as number,
                            array[37] as string,
                            array[38] as string,
                            array[39] as number,
                            array[40] as number,
                            array[41] as number,
                            array[42] as number,
                            array[43] as number,
                            array[44] as number,
                            array[45] as number,
                            array[46] as number,
                            array[47] as number,
                            array[48] as number,
                            array[49] as string,
                            array[50] as string,
                            array[51] as number,
                            array[52] as number,
                            array[53] as number,
                            array[54] as string,
                            array[55] as number,
                            array[56] as string,
                            array[57] as number,
                            array[58] as number,
                            array[59] as number)
    }

}
