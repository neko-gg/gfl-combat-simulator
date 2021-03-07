import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import {EchelonListPosition} from "@app/model/EchelonListPosition";
import TDoll from "@app/model/TDoll";

export default class TDollInEchelon {
    tDoll: TDoll;
    gridPosition: EchelonGridPosition;
    listPosition: EchelonListPosition;

    constructor(tDoll: TDoll, gridPosition: EchelonGridPosition, listPosition: EchelonListPosition) {
        this.tDoll = tDoll;
        this.gridPosition = gridPosition;
        this.listPosition = listPosition;
    }
}
