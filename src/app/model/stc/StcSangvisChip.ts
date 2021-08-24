export default class StcSangvisChip {
    id: number;
    name: string;
    unlock_furniture_level: number;
    type: number;
    equip_boss: number;
    dev_specialitem_num: string;
    code: string;
    des: string;
    dev_battery_num: number;
    dev_time: number;
    active_special_skill: string;
    active_special_skill_cd: string;
    active_special_skill_cost: string;
    active_mission_skill: string;
    chip_skill: string;
    passive_mission_skill: string;
    special_skill_parameter: string;
    night_view_percent: number;

    constructor(id: number, name: string, unlock_furniture_level: number, type: number, equip_boss: number, dev_specialitem_num: string, code: string, des: string, dev_battery_num: number, dev_time: number, active_special_skill: string, active_special_skill_cd: string, active_special_skill_cost: string, active_mission_skill: string, chip_skill: string, passive_mission_skill: string, special_skill_parameter: string, night_view_percent: number) {
        this.id = id;
        this.name = name;
        this.unlock_furniture_level = unlock_furniture_level;
        this.type = type;
        this.equip_boss = equip_boss;
        this.dev_specialitem_num = dev_specialitem_num;
        this.code = code;
        this.des = des;
        this.dev_battery_num = dev_battery_num;
        this.dev_time = dev_time;
        this.active_special_skill = active_special_skill;
        this.active_special_skill_cd = active_special_skill_cd;
        this.active_special_skill_cost = active_special_skill_cost;
        this.active_mission_skill = active_mission_skill;
        this.chip_skill = chip_skill;
        this.passive_mission_skill = passive_mission_skill;
        this.special_skill_parameter = special_skill_parameter;
        this.night_view_percent = night_view_percent;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvisChip {
        return new StcSangvisChip(array[0] as number,
                                  array[1] as string,
                                  array[2] as number,
                                  array[3] as number,
                                  array[4] as number,
                                  array[5] as string,
                                  array[6] as string,
                                  array[7] as string,
                                  array[8] as number,
                                  array[9] as number,
                                  array[10] as string,
                                  array[11] as string,
                                  array[12] as string,
                                  array[13] as string,
                                  array[14] as string,
                                  array[15] as string,
                                  array[16] as string,
                                  array[17] as number)
    }

}
