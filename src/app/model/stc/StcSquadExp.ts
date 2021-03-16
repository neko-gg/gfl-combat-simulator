export default class StcSquadExp {
    lv: number;
    exp: number;
    precise: number;

    constructor(lv: number, exp: number, precise: number) {
        this.lv = lv;
        this.exp = exp;
        this.precise = precise;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadExp {
        return new StcSquadExp(array[0] as number,
                               array[1] as number,
                               array[2] as number)
    }

}
