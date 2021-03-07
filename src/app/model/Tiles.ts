import {EchelonGridPosition} from "@app/model/EchelonGridPosition";

export default class Tiles {
    stand: EchelonGridPosition;
    buffs: EchelonGridPosition[];

    constructor(stand: EchelonGridPosition, buffs: EchelonGridPosition[]) {
        this.stand = stand;
        this.buffs = buffs;
    }
}
