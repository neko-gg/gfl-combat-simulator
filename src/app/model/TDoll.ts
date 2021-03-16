import gunInfo from "@static/stc/GunInfo.json"
import gunTypeInfo from "@static/stc/catchdata/gun_type_info.json"
import gameConfigInfo from "@static/stc/catchdata/game_config_info.json"
import gunExpInfo from "@static/stc/catchdata/gun_exp_info.json"
import {Rarity} from "@app/model/Rarity";
import path from "path";
import {getStaticPath} from "@app/utils/static-loader";
import Tiles from "@app/model/Tiles";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import {TDollClass} from "@app/model/TDollClass";
import TDollStats from "@app/model/TDollStats";
import {getAssetTDoll} from "@app/model/asset/AssetTDoll";
import {EquipSlot} from "@app/model/EquipSlot";
import {equips} from "@app/model/Equips";
import {EquipClass} from "@app/model/EquipClass";
import {EquipType} from "@app/model/EquipType";
import Equip from "@app/model/Equip";
import {CurrentEquipStats} from "@app/model/EquipStats";
import FairyStats from "@app/model/FairyStats";
import {ceil, floor} from "@app/utils/math";

export default class TDoll {
    private readonly _modOffset = 20_000;

    id: number;
    skillOne = 10;
    private _skillTwo: number | undefined = undefined;
    private _oathed = false;

    private _affection = 100;
    private _mod: undefined | number = undefined;
    private _level = 100;
    private _dummies = 5;

    private _equipOne: Equip | undefined = undefined;
    private _equipTwo: Equip | undefined = undefined;
    private _equipThree: Equip | undefined = undefined;

    constructor(id: number) {
        this.id = id;

        if (this.isModdable()) {
            if (!this.isModded()) this.id += this._modOffset;
            this._skillTwo = 10;
            this._mod = 3;
        }

        this.level = this.maxLevel();
        this.affection = this.maxAffection();
        this.dummies = this.maxDummies();
        this.setBestEquips();
    }

    private setBestEquips(evenIfNotPresent = true) {
        const getBestEquip = (equipSlot: EquipSlot, currentEquip: Equip) => {
            if (!evenIfNotPresent && !currentEquip) return currentEquip;
            const equipsForSlot = this.equipsForSlot(equipSlot);
            return equipsForSlot?.includes(currentEquip) ? currentEquip : equipsForSlot && equipsForSlot[0];
        }

        this.equipOne = getBestEquip(EquipSlot.ONE, this.equipOne);
        this.equipTwo = getBestEquip(EquipSlot.TWO, this.equipTwo);
        this.equipThree = getBestEquip(EquipSlot.THREE, this.equipThree);
    }

    get level(): number {
        return this._level;
    }

    set level(level: number) {
        this._level = Math.max(this.minLevel(), Math.min(level, this.maxLevel()));
        this.dummies = this._dummies;
        this.affection = this._affection
        this.setBestEquips(false);
    }

    get dummies(): number {
        return this._dummies;
    }

    set dummies(dummies: number) {
        this._dummies = Math.min(dummies, this.maxDummies());
    }

    get affection(): number {
        return this._affection;
    }

    set affection(affection: number) {
        this._affection = Math.max(0, Math.min(affection, this.maxAffection()));
    }

    get oathed(): boolean {
        return this._oathed;
    }

    set oathed(value: boolean) {
        this._oathed = value;
        this.affection = this._affection;
    }

    get mod(): number | undefined {
        return this._mod;
    }

    set mod(value: number | undefined) {
        if (this.isModdable()) {
            this._mod = value;
            if (!this.isModded() && this.mod > 0) {
                this.id += this._modOffset;
            } else if (this.isModded() && this.mod === 0) {
                this.id -= this._modOffset;
            }
        } else {
            this._mod = undefined;
        }

        this.level = this._level;
        this.skillTwo = this._skillTwo;
    }

    get skillTwo(): number | undefined {
        return this._skillTwo;
    }

    set skillTwo(skillTwo: number | undefined) {
        this._skillTwo = this.isModded() && this.mod >= 2 ? Math.max(0, Math.min(skillTwo || 10, 10)) : undefined;
    }

    get equipOne(): Equip | undefined {
        return this._equipOne;
    }

    set equipOne(value: Equip | undefined) {
        this._equipOne = value;
    }

    get equipTwo(): Equip | undefined {
        return this._equipTwo;
    }

    set equipTwo(value: Equip | undefined) {
        this._equipTwo = value;
    }

    get equipThree(): Equip | undefined {
        return this._equipThree;
    }

    set equipThree(value: Equip | undefined) {
        this._equipThree = value;
    }

    name(): string | undefined {
        const gunInfo = this.findFromGunInfo();
        const gunInfoNameCode = gunInfo?.name;
        const assetName = getAssetTDoll(gunInfoNameCode);
        if (!assetName || assetName.trim() === '') return gunInfo?.en_name;
        return assetName;
    }

    rarity(): Rarity | undefined {
        return this.findFromGunInfo()?.rank_display;
    }

    chibi(): string | undefined {
        const code = this.findFromGunInfo()?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('chibi', code, `${code}.png`));
    }

    profilePic(): string | undefined {
        const code = this.findFromGunInfo()?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('profile-pic', `pic_${code}_n.png`));
    }

    tiles(): Tiles | undefined {
        const standNum = this.findFromGunInfo()?.effect_grid_center;
        if (standNum === undefined) return undefined;

        const stand = TDoll.getStandTile(standNum);
        if (stand === undefined) return undefined;

        const buffsString: string = this.findFromGunInfo()?.effect_grid_pos;

        if (!buffsString || buffsString.length <= 0) return new Tiles(stand, []);

        const buffs: EchelonGridPosition[] = buffsString.split(',')
                                                        .map(buffString => Number.parseInt(buffString))
                                                        .map(buffNum => TDoll.getBuffsTile(buffNum, standNum));

        return new Tiles(stand, buffs);
    }

    class(): TDollClass | undefined {
        return this.findFromGunInfo()?.type;
    }

    maxAffection(): number {
        if (this._mod === 3 && this._oathed) return 200;
        if (this._oathed) return 150;
        return 100;
    }

    minLevel(): number {
        if (this._mod === 3) return 115;
        if (this._mod === 2) return 110;
        if (this._mod === 1) return 100;
        return 1;
    }

    maxLevel(): number {
        if (this._mod === 3) return 120;
        if (this._mod === 2) return 115;
        if (this._mod === 1) return 110;
        return 100;
    }

    maxDummies(): number | undefined {
        if (!this.level) return undefined;
        if (this.level < 10) return 1;
        if (this.level < 30) return 2;
        if (this.level < 70) return 3;
        if (this.level < 90) return 4;
        return 5;
    }

    exp(): number {
        return gunExpInfo.filter(tDollExpInfo => Number.parseInt(tDollExpInfo.lv) < this.level)
                         .map(tDollExpInfo => tDollExpInfo.exp)
                         .map(exp => Number.parseInt(exp))
                         .reduce((a, b) => a + b, 0);
    }

    stats(fairyStats?: FairyStats): TDollStats {
        const classStats = gunTypeInfo.find(classStat => Number.parseInt(classStat.id) === this.class());
        if (!classStats) return undefined;

        const gunInfo = this.findFromGunInfo();
        if (!gunInfo) return undefined;

        const baseHp = this.getBaseGameConfigStat('life_basic');
        const baseDamage = this.getBaseGameConfigStat('power_basic');
        const baseRof = this.getBaseGameConfigStat('rate_basic');
        const baseAccuracy = this.getBaseGameConfigStat('hit_basic');
        const baseEvasion = this.getBaseGameConfigStat('dodge_basic');
        const baseArmor = this.getBaseGameConfigStat('armor_basic');
        const baseMovementSpeed = this.getBaseGameConfigStat('speed_basic');

        const enhancementDamage = this.getEnhancementGameConfigStat('power_grow');
        const enhancementRof = this.getEnhancementGameConfigStat('rate_grow');
        const enhancementAccuracy = this.getEnhancementGameConfigStat('hit_grow');
        const enhancementEvasion = this.getEnhancementGameConfigStat('dodge_grow');
        const enhancementRatio = gunInfo.eat_ratio;

        const fairyDamage = fairyStats?.damage || 0;
        const fairyCriticalDamage = fairyStats?.criticalDamage || 0;
        const fairyAccuracy = fairyStats?.accuracy || 0;
        const fairyEvasion = fairyStats?.evasion || 0;
        const fairyArmor = fairyStats?.armor || 0;

        const currentEquipsStats = [this.equipOne, this.equipTwo, this.equipThree].filter(equip => undefined !== equip)
                                                                                  .map(equip => equip.maxStats())
                                                                                  .reduce((a, b) => a.sum(b), new CurrentEquipStats());

        const affectionMultiplier = this.affectionMultiplier();
        const hp = this.calculateBaseStat(baseHp, Number.parseFloat(classStats.basic_attribute_life), gunInfo.ratio_life) * this.dummies;
        const damage = ceil((this.calculateEnhancementStat(baseDamage, enhancementDamage, Number.parseFloat(classStats.basic_attribute_pow), gunInfo.ratio_pow, enhancementRatio, affectionMultiplier) + currentEquipsStats.damage) * (fairyDamage / 100 + 1));
        const rof = this.calculateEnhancementStat(baseRof, enhancementRof, Number.parseFloat(classStats.basic_attribute_rate), gunInfo.ratio_rate, enhancementRatio) + currentEquipsStats.rof;
        const accuracy = ceil((this.calculateEnhancementStat(baseAccuracy, enhancementAccuracy, Number.parseFloat(classStats.basic_attribute_hit), gunInfo.ratio_hit, enhancementRatio, affectionMultiplier) + currentEquipsStats.accuracy) * (fairyAccuracy / 100 + 1));
        const evasion = ceil((this.calculateEnhancementStat(baseEvasion, enhancementEvasion, Number.parseFloat(classStats.basic_attribute_dodge), gunInfo.ratio_dodge, enhancementRatio, affectionMultiplier) + currentEquipsStats.evasion) * (fairyEvasion / 100 + 1));
        const armor = ceil((this.calculateBaseStat(baseArmor, Number.parseFloat(classStats.basic_attribute_armor), gunInfo.ratio_armor) + currentEquipsStats.armor) * (fairyArmor / 100 + 1));
        const movementSpeed = this.calculateBaseStat(baseMovementSpeed, Number.parseFloat(classStats.basic_attribute_speed), gunInfo.ratio_speed) + currentEquipsStats.movementSpeed;
        const armorPenetration = gunInfo.armor_piercing + currentEquipsStats.armorPenetration;
        const criticalRate = gunInfo.crit + currentEquipsStats.criticalRate;
        const criticalDamage = ceil((150 + currentEquipsStats.criticalDamage) * (fairyCriticalDamage / 100 + 1) - 100);
        const rounds = gunInfo.special + currentEquipsStats.rounds;

        return {
            hp: hp,
            damage: damage,
            rof: rof,
            accuracy: accuracy,
            evasion: evasion,
            armor: armor,
            movementSpeed: movementSpeed,
            armorPenetration: armorPenetration,
            criticalRate: criticalRate,
            criticalDamage: criticalDamage,
            rounds: rounds
        }
    }

    calculateDeltaStat(stat: 'damage' | 'rof' | 'accuracy' | 'evasion'): number | undefined {
        const classStats = gunTypeInfo.find(classStat => Number.parseInt(classStat.id) === this.class());
        if (!classStats) return undefined;

        const gunInfo = this.findFromGunInfo();
        if (!gunInfo) return undefined;

        const enhancementRatio = gunInfo.eat_ratio;

        let statConfigName = undefined;
        let attributeConfigName = undefined;
        switch (stat) {
            case "damage":
                statConfigName = 'power';
                attributeConfigName = 'pow';
                break;
            case "rof":
                statConfigName = 'rate';
                attributeConfigName = 'rate';
                break;
            case "accuracy":
                statConfigName = 'hit';
                attributeConfigName = 'hit';
                break;
            case "evasion":
                statConfigName = 'dodge';
                attributeConfigName = 'dodge';
                break;
        }

        const baseStatAttribute = this.getBaseGameConfigStat(`${statConfigName}_basic`);
        const enhancementStatAttribute = this.getEnhancementGameConfigStat(`${statConfigName}_grow`);
        const classStat = Number.parseFloat(classStats[`basic_attribute_${attributeConfigName}` as 'basic_attribute_pow' | 'basic_attribute_rate' | 'basic_attribute_hit' | 'basic_attribute_dodge']);
        const tDollStat = gunInfo[`ratio_${attributeConfigName}` as 'ratio_pow' | 'ratio_rate' | 'ratio_hit' | 'ratio_dodge'];

        const baseStat = this.calculateBaseStat(baseStatAttribute, classStat, tDollStat);
        const enhancementStat = this.calculateEnhancementStat(baseStatAttribute, enhancementStatAttribute, classStat, tDollStat, enhancementRatio, 1);
        return enhancementStat - baseStat;
    }

    equipsForSlot(equipSlot: EquipSlot): Equip[] | undefined {
        const gunInfo = this.findFromGunInfo();
        const equipLevelLimit = gameConfigInfo.find(gameConfig => gameConfig.parameter_name === 'equip_level_limit').parameter_value
                                              .split(',')
                                              .map(levelLimit => levelLimit.split('-')[0])
                                              .map(levelLimit => Number.parseInt(levelLimit));

        if (this.level < equipLevelLimit[equipSlot - 1]) {
            return undefined;
        }

        const equipTypeString = EquipSlot.ONE === equipSlot
                                ? gunInfo.type_equip1
                                : EquipSlot.TWO === equipSlot
                                  ? gunInfo.type_equip2
                                  : gunInfo.type_equip3;

        const equipTypeSplit = equipTypeString.split(';');
        const equipClass: EquipClass = Number.parseInt(equipTypeSplit[0]);
        const equipTypesString = equipTypeSplit[1];
        const equipTypes: EquipType[] = equipTypesString.split(',').map(equipType => Number.parseInt(equipType));
        const otherEquips = [this.equipOne, this.equipTwo, this.equipThree].filter((equip, index) => index + 1 !== equipSlot);

        const equipRarityLimit = gameConfigInfo.find(gameConfig => gameConfig.parameter_name === 'equip_rank_level_limit').parameter_value
                                               .split(',')
                                               .map(levelLimit => levelLimit.split('-'))
                                               .map(levelLimit => levelLimit.map(split => Number.parseInt(split)))
                                               .reverse();

        return [...equips].filter(equip => equipClass === equip.class())
                          .filter(equip => equipTypes.includes(equip.type()))
                          .filter(equip => equip.fits() === 'all' || (equip.fits() as number[]).includes(this.id))
                          .filter(equip => !otherEquips.map(otherEquip => otherEquip?.type()).includes(equip?.type()))
                          .filter(equip => equip.rarity() <= (equipRarityLimit.find(rarityLimit => this.level >= rarityLimit[0]) || [0, 0])[1])
                          .sort((a, b) => {
                              if (a.fits() != 'all') return b.fits() != 'all' ? 0 : -1;
                              if (b.fits() != 'all') return 1;
                              return b.rarity() - a.rarity();
                          });
    }

    combatEffectiveness(fairyStats?: FairyStats): number {
        const attackCombatEffectiveness = this.class() === TDollClass.MG
                                          ? this.mgAttackCombatEffectiveness(fairyStats)
                                          : this.class() === TDollClass.SG
                                            ? this.sgAttackCombatEffectiveness(fairyStats)
                                            : this.attackCombatEffectiveness(fairyStats);

        return attackCombatEffectiveness + this.defenseCombatEffectiveness(fairyStats) + this.skillOneCombatEffectiveness() + this.skillTwoCombatEffectiveness();
    }

    private mgAttackCombatEffectiveness(fairyStats?: FairyStats): number {
        const stats = this.stats(fairyStats);
        const mgAttackEffect = gameConfigInfo.find(gameConfig => 'attack_effect_mg' === gameConfig.parameter_name).parameter_value.split(',')
                                             .map(x => Number.parseFloat(x));

        return ceil((((((((stats.criticalDamage * (stats.criticalRate / 100.0)) / 100.0 + 1.0) * (((stats.armorPenetration / mgAttackEffect[6]) + stats.damage) * stats.rounds)) / ((mgAttackEffect[3] / stats.rof) + (stats.rounds / 3.0) + mgAttackEffect[2])) * stats.accuracy) / (stats.accuracy + mgAttackEffect[4])) + mgAttackEffect[5]) * (mgAttackEffect[0] * this.dummies));
    }

    private sgAttackCombatEffectiveness(fairyStats?: FairyStats): number {
        const stats = this.stats(fairyStats);
        const sgAttackEffect = gameConfigInfo.find(gameConfig => 'attack_effect_sg' === gameConfig.parameter_name).parameter_value.split(',')
                                             .map(x => Number.parseFloat(x));

        return ceil(((((((((stats.criticalDamage * (stats.criticalRate / 100.0)) / 100.0) + 1.0) * (((stats.armorPenetration / sgAttackEffect[5]) + stats.damage) * (sgAttackEffect[6] * stats.rounds))) / ((stats.rounds * sgAttackEffect[8]) + (((sgAttackEffect[4] * stats.rounds) / stats.rof) + sgAttackEffect[7]))) * stats.accuracy) / (stats.accuracy + sgAttackEffect[2])) + sgAttackEffect[3]) * (sgAttackEffect[0] * this.dummies));
    }

    private attackCombatEffectiveness(fairyStats?: FairyStats): number {
        const stats = this.stats(fairyStats);
        const attackEffect = gameConfigInfo.find(gameConfig => 'attack_effect_normal' === gameConfig.parameter_name).parameter_value.split(',')
                                           .map(x => Number.parseFloat(x));

        return ceil((((stats.rof * ((stats.criticalDamage * (stats.criticalRate / 100.0)) / 100.0 + 1.0) * (stats.armorPenetration / attackEffect[5] + stats.damage)) / attackEffect[4]) * stats.accuracy / (stats.accuracy + attackEffect[2]) + attackEffect[3]) * attackEffect[0] * this.dummies);
    }

    private defenseCombatEffectiveness(fairyStats?: FairyStats): number {
        const stats = this.stats(fairyStats);
        const defenseEffect = gameConfigInfo.find(gameConfig => 'deffence_effect' === gameConfig.parameter_name).parameter_value.split(',')
                                            .map(x => Number.parseFloat(x));

        return defenseEffect[0] * ceil((((defenseEffect[2] * defenseEffect[3]) / Math.max(defenseEffect[3] - (stats.armor / defenseEffect[5]), 1.0)) - defenseEffect[4]) * (((stats.evasion + defenseEffect[1]) / defenseEffect[1]) * stats.hp));
    }

    private skillCombatEffectiveness(skillLevel: number, skillNumber: 'one' | 'two'): number {
        if (!skillLevel) return 0;

        const rarity = this.rarity() === Rarity.EXTRA ? Rarity.FIVE_STARS : this.rarity();
        const skillEffect = gameConfigInfo.find(gameConfig => `skill${'one' === skillNumber ? '' : '2'}_effect` === gameConfig.parameter_name).parameter_value.split(',')
                                          .map(skillEffect => Number.parseFloat(skillEffect));

        return ceil(ceil(skillLevel / 10.0) * ((skillEffect[0] + (skillEffect[1] * (skillLevel - 1))) * (this.dummies * ((rarity / 10.0) + 0.8))));
    }

    private skillOneCombatEffectiveness(): number {
        return this.skillCombatEffectiveness(this.skillOne, 'one');
    }

    private skillTwoCombatEffectiveness(): number {
        return this.skillCombatEffectiveness(this.skillTwo, 'two');
    }

    private isModded(): boolean {
        return this.id >= this._modOffset;
    }

    private isModdable(): boolean {
        if (this.isModded()) return true;
        return gunInfo.findIndex(gunInfoElement => this.id + this._modOffset === gunInfoElement.id) >= 0;
    }

    private findFromGunInfo() {
        return gunInfo.find(gunInfoElement => this.id === gunInfoElement.id);
    }

    private calculateBaseStat(baseStat: number[], classStat: number, tDollStat: number) {
        return ceil((baseStat[0] + (this.level - 1) * (baseStat[1] || 0)) * classStat * tDollStat / 100);
    }

    private calculateEnhancementStat(baseStat: number[], enhancementStat: number[], classStat: number, tDollStat: number, tDollEnhancementRatio: number, affectionMultiplier = 1) {
        const floatingEnhancementStat = (this.calculateBaseStat(baseStat, classStat, tDollStat) + ceil((enhancementStat[1] + (this.level - 1) * enhancementStat[0]) * classStat * tDollStat * tDollEnhancementRatio / 10_000)) * affectionMultiplier;
        return affectionMultiplier >= 1 ? ceil(floatingEnhancementStat) : floor(floatingEnhancementStat);
    }

    private getBaseGameConfigStat(gameConfigStat: string): number[] {
        const modConfig = gameConfigInfo.find(gameConfig => gameConfig.parameter_name === `${gameConfigStat}_after100`);
        const gameConfig = this.level > 100 && modConfig ? modConfig : gameConfigInfo.find(gameConfig => gameConfigStat === gameConfig.parameter_name);

        return gameConfig.parameter_value
                         .split(',')
                         .slice(0, -1)
                         .map(stat => Number.parseFloat(stat));
    }

    private getEnhancementGameConfigStat(gameConfigStat: string): number[] {
        const modConfig = gameConfigInfo.find(gameConfig => gameConfig.parameter_name === `${gameConfigStat}_after100`);
        const gameConfig = this.level > 100 && modConfig ? modConfig : gameConfigInfo.find(gameConfig => gameConfigStat === gameConfig.parameter_name);

        const enhancementGameConfigStat = gameConfig.parameter_value.split(',');
        enhancementGameConfigStat.splice(1, 2)
        return enhancementGameConfigStat.map(stat => Number.parseFloat(stat));
    }

    private affectionMultiplier() {
        const getAttribute = (parameterName: string) => Number.parseFloat(gameConfigInfo.find(gameConfig => parameterName === gameConfig.parameter_name).parameter_value) + 1;
        if (this._affection < 10) return getAttribute('favor_attribute_0_9');
        if (this._affection < 90) return getAttribute('favor_attribute_10_89');
        if (this._affection < 140) return getAttribute('favor_attribute_90_139');
        if (this._affection < 190) return getAttribute('favor_attribute_140');
        return getAttribute('favor_attribute_190');
    }

    private static getStandTile(standNum: number) {
        switch (standNum) {
            case 17:
                return EchelonGridPosition.TOP_LEFT;
            case 12:
                return EchelonGridPosition.TOP_CENTER;
            case 7:
                return EchelonGridPosition.TOP_RIGHT;
            case 18:
                return EchelonGridPosition.MIDDLE_LEFT;
            case 13:
                return EchelonGridPosition.MIDDLE_CENTER;
            case 8:
                return EchelonGridPosition.MIDDLE_RIGHT;
            case 19:
                return EchelonGridPosition.BOTTOM_LEFT;
            case 14:
                return EchelonGridPosition.BOTTOM_CENTER;
            case 9:
                return EchelonGridPosition.BOTTOM_RIGHT;
        }
    }

    private static getBuffsTile(buffNum: number, stand: number) {
        switch (buffNum - stand) {
            case -6:
                return EchelonGridPosition.BOTTOM_LEFT;
            case -5:
                return EchelonGridPosition.MIDDLE_LEFT;
            case -4:
                return EchelonGridPosition.TOP_LEFT;
            case -1:
                return EchelonGridPosition.BOTTOM_CENTER;
            case 0:
                return EchelonGridPosition.MIDDLE_CENTER;
            case 1:
                return EchelonGridPosition.TOP_CENTER;
            case 4:
                return EchelonGridPosition.BOTTOM_RIGHT;
            case 5:
                return EchelonGridPosition.MIDDLE_RIGHT;
            case 6:
                return EchelonGridPosition.TOP_RIGHT;
        }
    }
}
