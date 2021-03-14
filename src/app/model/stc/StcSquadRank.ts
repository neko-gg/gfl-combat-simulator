export default class StcSquadRank {
    star_id: number;
    lv_unlock: string;
    cost_self_piece: number;
    cpu_rate: number;

    constructor(star_id: number, lv_unlock: string, cost_self_piece: number, cpu_rate: number) {
        this.star_id = star_id;
        this.lv_unlock = lv_unlock;
        this.cost_self_piece = cost_self_piece;
        this.cpu_rate = cpu_rate;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadRank {
        return new StcSquadRank(array[0] as number,
                                array[1] as string,
                                array[2] as number,
                                array[3] as number)
    }

}
