export default class StcSquadType {
    type_id: number;
    name: string;
    en_name: string;
    class_name: string;
    class_en_name: string;
    hp: number;
    assist_damage: number;
    assist_reload: number;
    assist_hit: number;
    assist_def_break: number;
    damage: number;
    atk_speed: number;
    hit: number;
    def: number;
    fix_type: number;
    fix_time: number;
    mp_fix: number;
    part_fix: number;

    constructor(type_id: number, name: string, en_name: string, class_name: string, class_en_name: string, hp: number, assist_damage: number, assist_reload: number, assist_hit: number, assist_def_break: number, damage: number, atk_speed: number, hit: number, def: number, fix_type: number, fix_time: number, mp_fix: number, part_fix: number) {
        this.type_id = type_id;
        this.name = name;
        this.en_name = en_name;
        this.class_name = class_name;
        this.class_en_name = class_en_name;
        this.hp = hp;
        this.assist_damage = assist_damage;
        this.assist_reload = assist_reload;
        this.assist_hit = assist_hit;
        this.assist_def_break = assist_def_break;
        this.damage = damage;
        this.atk_speed = atk_speed;
        this.hit = hit;
        this.def = def;
        this.fix_type = fix_type;
        this.fix_time = fix_time;
        this.mp_fix = mp_fix;
        this.part_fix = part_fix;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadType {
        return new StcSquadType(array[0] as number,
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
                                array[12] as number,
                                array[13] as number,
                                array[14] as number,
                                array[15] as number,
                                array[16] as number,
                                array[17] as number)
    }

}
