import Fairy from "@app/model/Fairy";

export default class FairyInEchelon {
    fairy: Fairy;
    skillActive: boolean;
    talentTriggers: boolean;

    constructor(fairy: Fairy, skillActive: boolean, talentTriggers: boolean) {
        this.fairy = fairy;
        this.skillActive = skillActive;
        this.talentTriggers = talentTriggers;
    }
}
