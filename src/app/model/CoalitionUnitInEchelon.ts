import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import CoalitionUnit from "@app/model/CoalitionUnit";

export default class CoalitionUnitInEchelon {
    coalitionUnit: CoalitionUnit;
    gridPosition: EchelonGridPosition;

    constructor(coalitionUnit: CoalitionUnit, gridPosition: EchelonGridPosition) {
        this.coalitionUnit = coalitionUnit;
        this.gridPosition = gridPosition;
    }
}
