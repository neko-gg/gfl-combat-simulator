import equipInfo from "@static/stc/EquipInfo.json";
import {EquipClass} from "@app/model/EquipClass";
import {EquipType} from "@app/model/EquipType";
import {getStaticPath} from "@app/utils/static-loader";
import EquipStats, {CurrentEquipStats, EquipStat} from "@app/model/EquipStats";
import path from "path";
import {getAssetEquip} from "@app/model/asset/AssetEquip";

export default class Equip {
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    class(): EquipClass | undefined {
        return this.findFromEquipInfo()?.category;
    }

    type(): EquipType | undefined {
        return this.findFromEquipInfo()?.type;
    }

    name(): string | undefined {
        const equipInfo = this.findFromEquipInfo();
        const equipInfoNameCode = equipInfo?.name;
        return getAssetEquip(equipInfoNameCode) || equipInfoNameCode;
    }

    fits(): number[] | 'all' {
        const fitGuns = this.findFromEquipInfo()?.fit_guns;
        if (!fitGuns) return 'all';
        return fitGuns.split(',')
                      .map(fitGun => Number.parseInt(fitGun));
    }

    icon(): string | undefined {
        const code = this.findFromEquipInfo()?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('icon', 'equip', `${Buffer.from(code).toString('hex')}.png`));
    }

    rarity(): number | undefined {
        return this.findFromEquipInfo()?.rank;
    }

    stats(): EquipStats | undefined {
        const equipInfo = this.findFromEquipInfo();
        if (!equipInfo) return undefined;

        const bonusString = equipInfo.bonus_type;

        function getStat(statName: keyof typeof equipInfo) {
            const statString = equipInfo[statName] as string;
            const statSplit = statString.split(',');
            const min = Number.parseInt(statSplit[0]);
            const max = Number.parseInt(statSplit[1]);
            const upgrade = bonusString.split(',')
                                       .map(bonus => bonus.split(':'))
                                       .filter(bonus => bonus[0] === statName)
                                       .map(bonus => bonus[1])
                                       .map(bonus => Number.parseFloat(bonus))
                                       .pop();
            return {
                min: min,
                max: max,
                upgrade: upgrade
            }
        }

        return {
            damage: getStat('pow'),
            rof: getStat('rate'),
            accuracy: getStat('hit'),
            evasion: getStat('dodge'),
            armor: getStat('armor'),
            movementSpeed: getStat('speed'),
            armorPenetration: getStat('armor_piercing'),
            criticalRate: getStat('critical_percent'),
            criticalDamage: getStat('critical_harm_rate'),
            nightVision: getStat('night_view_percent'),
            rounds: getStat('bullet_number_up'),
            skillEffectModifier: equipInfo.skill_effect_per
        };
    }

    maxStats(): CurrentEquipStats {
        const stats = this.stats();
        const calculateStat = (stat: EquipStat | number, level = this.maxLevel()) => typeof stat === 'number' ? stat : Math.floor(stat.max * (10_000 + level * (stat.upgrade || 0)) / 10_000) || 0;
        const maxStats = new CurrentEquipStats();

        Object.keys(stats)
              .forEach((key: keyof EquipStats) => maxStats[key] = calculateStat(stats[key]));

        return maxStats;
    }

    maxExp(): number {
        const equipInfo = this.findFromEquipInfo();
        return (equipInfo.exclusive_rate || 1) * this.maxLevel() * 1_000;
    }

    maxLevel(): number | undefined {
        const equipInfo = this.findFromEquipInfo();
        if(!equipInfo) return undefined;

        return equipInfo.max_level;
    }

    private findFromEquipInfo() {
        return equipInfo.find(equipInfoElement => this.id === equipInfoElement.id);
    }

}
