import equipInfo from "@static/stc/EquipInfo.json";
import Equip from "@app/model/Equip";
import fs from "fs";

export const equips: Equip[] = equipInfo.map(equipInfo => equipInfo.id)
                                        .map(id => new Equip(id))
                                        .filter(equip => fs.existsSync(equip.icon()));
