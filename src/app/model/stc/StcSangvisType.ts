export default class StcSangvisType {
    id: number;
    name: string;
    basic_hp: number;
    basic_pow: number;
    basic_rate: number;
    basic_speed: number;
    basic_hit: number;
    basic_dodge: number;
    basic_armor: number;
    mp_fix_ratio: number;
    part_fix_ratio: number;
    fix_time_ratio: number;
    skill_advance_lv: number;
    pic_advance_lv: number;
    daily_successr: number;
    author_successr: number;
    default_advance_lv: number;
    exchange_num: string;
    repair_cost: number;
    trans_num: string;
    skills_max_lv: string;

    constructor(id: number, name: string, basic_hp: number, basic_pow: number, basic_rate: number, basic_speed: number, basic_hit: number, basic_dodge: number, basic_armor: number, mp_fix_ratio: number, part_fix_ratio: number, fix_time_ratio: number, skill_advance_lv: number, pic_advance_lv: number, daily_successr: number, author_successr: number, default_advance_lv: number, exchange_num: string, repair_cost: number, trans_num: string, skills_max_lv: string) {
        this.id = id;
        this.name = name;
        this.basic_hp = basic_hp;
        this.basic_pow = basic_pow;
        this.basic_rate = basic_rate;
        this.basic_speed = basic_speed;
        this.basic_hit = basic_hit;
        this.basic_dodge = basic_dodge;
        this.basic_armor = basic_armor;
        this.mp_fix_ratio = mp_fix_ratio;
        this.part_fix_ratio = part_fix_ratio;
        this.fix_time_ratio = fix_time_ratio;
        this.skill_advance_lv = skill_advance_lv;
        this.pic_advance_lv = pic_advance_lv;
        this.daily_successr = daily_successr;
        this.author_successr = author_successr;
        this.default_advance_lv = default_advance_lv;
        this.exchange_num = exchange_num;
        this.repair_cost = repair_cost;
        this.trans_num = trans_num;
        this.skills_max_lv = skills_max_lv;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvisType {
        return new StcSangvisType(array[0] as number,
                                  array[1] as string,
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
                                  array[19] as string,
                                  array[20] as string)
    }

}
