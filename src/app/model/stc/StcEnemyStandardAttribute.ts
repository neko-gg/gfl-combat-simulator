export default class StcEnemyStandardAttribute {
    level: number;
    maxlife: number;
    pow: number;
    dodge: number;
    hit: number;
    armor_piercing: number;
    armor: number;
    shield: number;
    def: number;
    def_break: number;

    constructor(level: number, maxlife: number, pow: number, dodge: number, hit: number, armor_piercing: number, armor: number, shield: number, def: number, def_break: number) {
        this.level = level;
        this.maxlife = maxlife;
        this.pow = pow;
        this.dodge = dodge;
        this.hit = hit;
        this.armor_piercing = armor_piercing;
        this.armor = armor;
        this.shield = shield;
        this.def = def;
        this.def_break = def_break;
    }

    static fromArray(array: (number | bigint | string)[]): StcEnemyStandardAttribute {
        return new StcEnemyStandardAttribute(array[0] as number,
                                             array[1] as number,
                                             array[2] as number,
                                             array[3] as number,
                                             array[4] as number,
                                             array[5] as number,
                                             array[6] as number,
                                             array[7] as number,
                                             array[8] as number,
                                             array[9] as number)
    }

}
