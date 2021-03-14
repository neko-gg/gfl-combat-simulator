export default class StcSquadCpu {
    id: number;
    color: number;
    grid1: number;
    grid2: number;
    grid3: number;
    grid4: number;
    grid5: number;
    cpu_bonus: number;

    constructor(id: number, color: number, grid1: number, grid2: number, grid3: number, grid4: number, grid5: number, cpu_bonus: number) {
        this.id = id;
        this.color = color;
        this.grid1 = grid1;
        this.grid2 = grid2;
        this.grid3 = grid3;
        this.grid4 = grid4;
        this.grid5 = grid5;
        this.cpu_bonus = cpu_bonus;
    }

    static fromArray(array: (number | bigint | string)[]): StcSquadCpu {
        return new StcSquadCpu(array[0] as number,
                               array[1] as number,
                               array[2] as number,
                               array[3] as number,
                               array[4] as number,
                               array[5] as number,
                               array[6] as number,
                               array[7] as number)
    }

}
