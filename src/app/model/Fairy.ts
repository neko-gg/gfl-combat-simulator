import {FairyTalent} from "@app/model/FairyTalent";
import {getAssetFairy} from "@app/model/asset/AssetFairy";
import fairyInfo from "@static/stc/FairyInfo.json";
import fairyExpInfo from "@static/stc/catchdata/fairy_exp_info.json";
import gameConfigInfo from "@static/stc/catchdata/game_config_info.json";
import {getStaticPath} from "@app/utils/static-loader";
import path from "path";
import FairyStats from "@app/model/FairyStats";
import {ceil, round} from "@app/utils/math";

export default class Fairy {
    id: number;
    level = 100;
    rarity = 5;
    skill = 10;
    talent = FairyTalent.DAMAGE_II;

    constructor(id: number) {
        this.id = id;
    }

    name(): string | undefined {
        const fairyInfo = this.findFromFairyInfo();
        if (!fairyInfo) return undefined;

        return getAssetFairy(fairyInfo.name);
    }

    exp(): number {
        return Number.parseInt(fairyExpInfo.find(fairyExpInfo => Number.parseInt(fairyExpInfo.id) === this.level).exp);
    }

    stats(): FairyStats | undefined {
        const fairyInfo = this.findFromFairyInfo();
        if (!fairyInfo) return undefined;

        const fairyDamage = fairyInfo.pow
        const fairyAccuracy = fairyInfo.hit
        const fairyEvasion = fairyInfo.dodge
        const fairyArmor = fairyInfo.armor
        const fairyCriticalDamage = fairyInfo.critical_harm_rate
        const fairyGrow = fairyInfo.grow;
        const fairyProportion = fairyInfo.proportion
                                         .split(',')
                                         .map(proportion => proportion.split(':').map(x => Number.parseFloat(x)))
                                         .map(proportion => proportion[1]);

        const getParameterValue = (parameterName: string) => gameConfigInfo.find(gameConfigInfo => parameterName === gameConfigInfo.parameter_name).parameter_value
                                                                           .split(',')
                                                                           .map(x => Number.parseFloat(x));

        const enhancementDamage = getParameterValue('fairy_pow_grow');
        const enhancementAccuracy = getParameterValue('fairy_hit_grow');
        const enhancementEvasion = getParameterValue('fairy_dodge_grow');
        const enhancementArmor = getParameterValue('fairy_armor_grow');
        const enhancementCriticalDamage = getParameterValue('fairy_critical_harm_rate_grow');

        const getStat = (fairyStat: number, enhancementStat: number[]) => round(((fairyProportion[this.effectiveRarity() - 1] * (ceil(enhancementStat[0] * fairyStat / 100) + ceil((this.level - 1) * enhancementStat[1] * fairyStat * fairyGrow / 10_000))) + Number.EPSILON) * 100) / 100;

        return {
            damage: getStat(fairyDamage, enhancementDamage),
            criticalDamage: getStat(fairyCriticalDamage, enhancementCriticalDamage),
            accuracy: getStat(fairyAccuracy, enhancementAccuracy),
            evasion: getStat(fairyEvasion, enhancementEvasion),
            armor: getStat(fairyArmor, enhancementArmor)
        };
    }

    rarityExp(): number | undefined {
        const fairyInfo = this.findFromFairyInfo();
        if (!fairyInfo) return undefined;

        return fairyInfo.quality_need_number
                        .split(',')
                        .map(rarityExp => rarityExp.split(':'))
                        .map(rarityExp => rarityExp.map(x => Number.parseInt(x)))
                        .find(rarityExp => this.rarity === rarityExp[0])[1];
    }

    icon(): string | undefined {
        const code = this.findFromFairyInfo()?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('icon', 'fairy', `${code}_${this.rarity < 3 ? 1 : this.rarity < 5 ? 2 : 3}.png`));
    }

    effectiveRarity(): number | undefined {
        const rarityConfigInfo = gameConfigInfo.find(gameConfigInfo => 'fairy_quality_need_level' === gameConfigInfo.parameter_name);
        if (!rarityConfigInfo) return undefined;

        const maxRarity = rarityConfigInfo.parameter_value
                                          .split(',')
                                          .map(rarityPair => rarityPair.split(':'))
                                          .map(rarityPair => rarityPair.map(rarityPairElement => Number.parseInt(rarityPairElement)))
                                          .reverse()
                                          .find(rarityPair => this.level >= rarityPair[1])[0];

        return Math.min(this.rarity, maxRarity);
    }

    private findFromFairyInfo() {
        return fairyInfo.find(fairyInfoElement => this.id === fairyInfoElement.id);
    }
}
