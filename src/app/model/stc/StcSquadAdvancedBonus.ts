export default class StcSquadAdvancedBonus {
    id: number;
    group_id: number;
    lv: number;
    unlock_number: number;
    assist_damage: number;
    assist_reload: number;
    assist_hit: number;
    assist_def_break: number;
    damage: number;
    atk_speed: number;
    hit: number;
    def: number;

    constructor(id: number, group_id: number, lv: number, unlock_number: number, assist_damage: number, assist_reload: number, assist_hit: number, assist_def_break: number, damage: number, atk_speed: number, hit: number, def: number) {
        this.id = id;
        this.group_id = group_id;
        this.lv = lv;
        this.unlock_number = unlock_number;
        this.assist_damage = assist_damage;
        this.assist_reload = assist_reload;
        this.assist_hit = assist_hit;
        this.assist_def_break = assist_def_break;
        this.damage = damage;
        this.atk_speed = atk_speed;
        this.hit = hit;
        this.def = def;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadAdvancedBonus {
        return new StcSquadAdvancedBonus(array[0] as number,
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
                                         array[11] as number)
    }

}
