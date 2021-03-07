import {getAssetEnemyCharacterType} from "@app/model/asset/AssetEnemyCharacterType";

export default class EnemyCharacterType {
    id: number;
    type: number;
    private _name: string;
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

    get name(): string {
        return getAssetEnemyCharacterType(this._name);
    }

    set name(value: string) {
        this._name = value;
    }
}
