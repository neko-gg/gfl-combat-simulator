export default class StcSquadGrid {
    id: number;
    grid: string;
    grid_number: number;
    rank_weight: string;
    code: string;

    constructor(id: number, grid: string, grid_number: number, rank_weight: string, code: string) {
        this.id = id;
        this.grid = grid;
        this.grid_number = grid_number;
        this.rank_weight = rank_weight;
        this.code = code;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadGrid {
        return new StcSquadGrid(array[0] as number,
                                array[1] as string,
                                array[2] as number,
                                array[3] as string,
                                array[4] as string)
    }

}
