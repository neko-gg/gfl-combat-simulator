import gunInfo from "@static/stc/GunInfo.json";
import TDoll from "@app/model/TDoll";

export const tDolls: TDoll[] = gunInfo.map(gunInfo => gunInfo.id)
                                      .filter(id => id < 9000)
                                      .map(id => new TDoll(id));
