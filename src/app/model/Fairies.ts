import fairyInfo from "@static/stc/FairyInfo.json";
import Fairy from "@app/model/Fairy";
import fs from "fs";

export const fairies: Fairy[] = fairyInfo.map(fairyInfo => fairyInfo.id)
                                         .map(id => new Fairy(id))
                                         .filter(fairy => fs.existsSync(fairy.icon()));
