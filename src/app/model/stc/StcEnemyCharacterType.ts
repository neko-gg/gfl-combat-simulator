export default class StcEnemyCharacterType {
    id: number;
    type: number;
    name: string;
    enemy_info: string;
    code: string;
    maxlife: number;
    pow: number;
    hit: number;
    dodge: number;
    range: number;
    speed: number;
    number: number;
    angle: number;
    armor_piercing: number;
    armor: number;
    shield: number;
    rate: number;
    boss_hp: number;
    def: number;
    def_break: number;
    debuff_resistance: number;
    level: number;
    character: string;
    special_attack: number;
    normal_attack: number;
    passive_skill: string;
    effect_ratio: number;
    unable_buff_type: string;
    able_buff_id: string;
    voice: string;
    deployment_scale: number;
    recommend_description: string;
    hit_point: string;
    offset: string;
    lifebar_offset: string;
    enemy_illustration_id: number;


    constructor(id: number, type: number, name: string, enemy_info: string, code: string, maxlife: number, pow: number, hit: number, dodge: number, range: number, speed: number, number: number, angle: number, armor_piercing: number, armor: number, shield: number, rate: number, boss_hp: number, def: number, def_break: number, debuff_resistance: number, level: number, character: string, special_attack: number, normal_attack: number, passive_skill: string, effect_ratio: number, unable_buff_type: string, able_buff_id: string, voice: string, deployment_scale: number, recommend_description: string, hit_point: string, offset: string, lifebar_offset: string, enemy_illustration_id: number) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.enemy_info = enemy_info;
        this.code = code;
        this.maxlife = maxlife;
        this.pow = pow;
        this.hit = hit;
        this.dodge = dodge;
        this.range = range;
        this.speed = speed;
        this.number = number;
        this.angle = angle;
        this.armor_piercing = armor_piercing;
        this.armor = armor;
        this.shield = shield;
        this.rate = rate;
        this.boss_hp = boss_hp;
        this.def = def;
        this.def_break = def_break;
        this.debuff_resistance = debuff_resistance;
        this.level = level;
        this.character = character;
        this.special_attack = special_attack;
        this.normal_attack = normal_attack;
        this.passive_skill = passive_skill;
        this.effect_ratio = effect_ratio;
        this.unable_buff_type = unable_buff_type;
        this.able_buff_id = able_buff_id;
        this.voice = voice;
        this.deployment_scale = deployment_scale;
        this.recommend_description = recommend_description;
        this.hit_point = hit_point;
        this.offset = offset;
        this.lifebar_offset = lifebar_offset;
        this.enemy_illustration_id = enemy_illustration_id;
    }

    static fromArray(array: (number | bigint | string)[]): StcEnemyCharacterType {
        return new StcEnemyCharacterType(array[0] as number,
                                         array[1] as number,
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
                                         array[22] as string,
                                         array[23] as number,
                                         array[24] as number,
                                         array[25] as string,
                                         array[26] as number,
                                         array[27] as string,
                                         array[28] as string,
                                         array[29] as string,
                                         array[30] as number,
                                         array[31] as string,
                                         array[32] as string,
                                         array[33] as string,
                                         array[34] as string,
                                         array[35] as number)
    }

}
