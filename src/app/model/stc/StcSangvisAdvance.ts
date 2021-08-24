export default class StcSangvisAdvance {
    lv: number;
    star1: string;
    star2: string;
    star3: string;
    unlock_lv: number;
    advance_hp: number;
    advance_pow: number;
    advance_rate: number;
    advance_hit: number;
    advance_dodge: number;
    advance_armor: number;

    constructor(lv: number, star1: string, star2: string, star3: string, unlock_lv: number, advance_hp: number, advance_pow: number, advance_rate: number, advance_hit: number, advance_dodge: number, advance_armor: number) {
        this.lv = lv;
        this.star1 = star1;
        this.star2 = star2;
        this.star3 = star3;
        this.unlock_lv = unlock_lv;
        this.advance_hp = advance_hp;
        this.advance_pow = advance_pow;
        this.advance_rate = advance_rate;
        this.advance_hit = advance_hit;
        this.advance_dodge = advance_dodge;
        this.advance_armor = advance_armor;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvisAdvance {
        return new StcSangvisAdvance(array[0] as number,
                                     array[1] as string,
                                     array[2] as string,
                                     array[3] as string,
                                     array[4] as number,
                                     array[5] as number,
                                     array[6] as number,
                                     array[7] as number,
                                     array[8] as number,
                                     array[9] as number,
                                     array[10] as number)
    }

}
