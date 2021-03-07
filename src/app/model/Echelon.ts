import TDollInEchelon from "@app/model/TDollInEchelon";
import FairyInEchelon from "@app/model/FairyInEchelon";

export default class Echelon {
    tDollsInEchelon: TDollInEchelon[];
    fairyInEchelon: FairyInEchelon;

    constructor(tDollsInEchelon: TDollInEchelon[], fairyInEchelon: FairyInEchelon = undefined) {
        this.tDollsInEchelon = tDollsInEchelon;
        this.fairyInEchelon = fairyInEchelon;
    }
}
