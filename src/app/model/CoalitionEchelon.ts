import CoalitionUnitInEchelon from "@app/model/CoalitionUnitInEchelon";

export default class CoalitionEchelon {
    unitsInEchelon: CoalitionUnitInEchelon[];

    constructor(unitsInEchelon: CoalitionUnitInEchelon[]) {
        this.unitsInEchelon = unitsInEchelon;
    }

    leader(): CoalitionUnitInEchelon | undefined {
        if (this.unitsInEchelon && this.unitsInEchelon.length > 0) return this.unitsInEchelon[0];
        return undefined;
    }
}
