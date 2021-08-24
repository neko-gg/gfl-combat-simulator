export default class StcSangvisExp {
    lv: number;
    exp: number;

    constructor(lv: number, exp: number) {
        this.lv = lv;
        this.exp = exp;
    }

    static fromArray(array: (number | bigint | string)[]): StcSangvisExp {
        return new StcSangvisExp(array[0] as number,
                                 array[1] as number)
    }

}
