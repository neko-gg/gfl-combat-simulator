import sangvisChipInfo from "@static/stc/SangvisChip.json";
import CoalitionChip from "@app/model/CoalitionChip";

export const coalitionChips: CoalitionChip[] = sangvisChipInfo.map(sangvisChipInfo => sangvisChipInfo.id)
                                                              .map(id => new CoalitionChip(id));
