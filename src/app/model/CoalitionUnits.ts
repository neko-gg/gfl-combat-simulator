import sangvisInfo from "@static/stc/Sangvis.json";
import CoalitionUnit from "@app/model/CoalitionUnit";
import {CoalitionUnitType} from "@app/model/CoalitionUnitType";

export const allCoalitionUnits: CoalitionUnit[] = sangvisInfo.map(sangvisInfo => sangvisInfo.id)
                                                             .map(id => new CoalitionUnit(id));

export const notRingleadersCoalitionUnits: CoalitionUnit[] = allCoalitionUnits.filter(coalitionUnit => CoalitionUnitType.Ringleader !== coalitionUnit.type())
