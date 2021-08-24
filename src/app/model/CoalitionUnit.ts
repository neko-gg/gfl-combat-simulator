import sangvisInfo from "@static/stc/Sangvis.json"
import sangvisExpInfo from "@static/stc/SangvisExp.json"
import sangvisResolutionInfo from "@static/stc/SangvisResolution.json"
import sangvisTypeInfo from "@static/stc/SangvisType.json"
import sangvisAdvanceInfo from "@static/stc/SangvisAdvance.json"
import {Rarity} from "@app/model/Rarity";
import path from "path";
import {getStaticPath} from "@app/utils/static-loader";
import {getAssetSangvis} from "@app/model/asset/AssetSangvis";
import {CoalitionUnitType} from "@app/model/CoalitionUnitType";
import {CoalitionUnitSize} from "@app/model/CoalitionUnitSize";
import CoalitionChip from "@app/model/CoalitionChip";
import gameConfigInfo from "@static/stc/catchdata/game_config_info.json"
import {ceil} from "@app/utils/math";

const sangvisBaseLevel = Number.parseInt(gameConfigInfo.find(gameConfig => gameConfig.parameter_name === 'sangvis_base_lv').parameter_value);
const sangvisTypes = sangvisTypeInfo.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
}, []);
const sangvisAdvances = sangvisAdvanceInfo.reduce((acc, cur) => {
    acc[cur.lv] = cur;
    return acc;
}, []);
const sangvisShapes = gameConfigInfo.find(gameConfig => gameConfig.parameter_name === 'sangvis_shape_val').parameter_value
                                    .split(',')
                                    .map(shape => shape.split(':'))
                                    .map(shape => [Number.parseInt(shape[0]), Number.parseInt(shape[1])])
                                    .reduce((acc, cur) => {
                                        acc[cur[0]] = cur[1];
                                        return acc;
                                    }, []);

export default class CoalitionUnit {
    id: number;

    private _skillOne: number | undefined = undefined;
    private _skillTwo: number | undefined = undefined;
    private _skillThree: number | undefined = undefined;
    private _skillFour: number | undefined = undefined;

    private _chipOne: CoalitionChip | undefined = undefined;
    private _chipTwo: CoalitionChip | undefined = undefined;

    private _oathed = false;

    private _affection = 100;
    private _level = 100;
    private _rarity: Rarity;
    private _dummies = 5;
    private _size: CoalitionUnitSize | undefined;

    private sangvisInfo;

    constructor(id: number) {
        this.id = id;

        this.sangvisInfo = this.findFromSangvisInfo();

        this.level = this.maxLevel();
        this.affection = this.maxAffection();
        this.dummies = this.maxDummies();
        this.rarity = this.maxRarity();
        this.size = CoalitionUnitSize.XL;

        this.skillOne = 10;
        this.skillTwo = 10;
        this.skillThree = 10;
        this.skillFour = 10;

        this.chipOne = new CoalitionChip(3001);
        this.chipTwo = new CoalitionChip(3002);
    }

    get level(): number {
        return this._level;
    }

    set level(level: number) {
        this._level = Math.max(this.minLevel(), Math.min(level, this.maxLevel()));
        this.rarity = this._rarity;
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

    get size(): CoalitionUnitSize | undefined {
        return this._size;
    }

    set size(value: CoalitionUnitSize | undefined) {
        if (CoalitionUnitType.Ringleader != this.type() && value) {
            this._size = value;
        }
    }

    get skillOne(): number | undefined {
        return this._skillOne;
    }

    set skillOne(skillOne: number | undefined) {
        this._skillOne = [CoalitionUnitType.Ringleader, CoalitionUnitType.Elite].includes(this.type()) || this.rarity >= 4 ? Math.max(1, Math.min(skillOne, this.maxSkillOneTwo())) : undefined;
    }

    get skillTwo(): number | undefined {
        return this._skillTwo;
    }

    set skillTwo(skillTwo: number | undefined) {
        this._skillTwo = CoalitionUnitType.Ringleader == this.type() || (CoalitionUnitType.Elite == this.type() && this.rarity >= 4) ? Math.max(1, Math.min(skillTwo, this.maxSkillOneTwo())) : undefined;
    }

    get skillThree(): number | undefined {
        return this._skillThree;
    }

    set skillThree(skillThree: number | undefined) {
        this._skillThree = CoalitionUnitType.Ringleader == this.type() ? Math.max(1, Math.min(skillThree, 5)) : undefined;
    }

    get skillFour(): number | undefined {
        return this._skillFour;
    }

    set skillFour(skillFour: number | undefined) {
        this._skillFour = CoalitionUnitType.Ringleader == this.type() && this.rarity >= 4 ? Math.max(1, Math.min(skillFour, 5)) : undefined;
    }

    name(): string | undefined {
        const sangvisInfoNameCode = this.sangvisInfo.name;
        const assetName = getAssetSangvis(sangvisInfoNameCode);
        if (!assetName || assetName.trim() === '') return this.sangvisInfo.en_name;
        return assetName;
    }

    get rarity(): Rarity {
        return this._rarity;
    }

    set rarity(rarity: Rarity) {
        this._rarity = Math.max(this.initialRarity(), Math.min(rarity, this.maxRarity()));
        this.skillOne = this._skillOne || 10;
        this.skillTwo = this._skillTwo || 10;
        this.skillThree = this._skillThree || 10;
        this.skillFour = this._skillFour || 10;
        this.chipOne = this._chipOne;
        this.chipTwo = this._chipTwo;
    }

    get chipOne(): CoalitionChip | undefined {
        return this._chipOne;
    }

    set chipOne(value: CoalitionChip | undefined) {
        if (undefined != value && this.canEquipChipOne()) {
            if (this.chipTwo?.id !== value?.id) {
                this._chipOne = value;
            }
        } else {
            this._chipOne = undefined;
        }
    }

    get chipTwo(): CoalitionChip | undefined {
        return this._chipTwo;
    }

    set chipTwo(value: CoalitionChip | undefined) {
        if (undefined != value && this.canEquipChipTwo()) {
            if (this.chipOne?.id !== value?.id) {
                this._chipTwo = value;
            }
        } else {
            this._chipTwo = undefined;
        }
    }

    canEquipChipOne(): boolean {
        return CoalitionUnitType.Ringleader == this.type();
    }

    canEquipChipTwo(): boolean {
        return CoalitionUnitType.Ringleader == this.type() && this.rarity >= 4;
    }

    maxRarity(): Rarity {
        if (!this.level) return undefined;
        let rarity = 5;
        if (this.level < 90) rarity = 4;
        if (this.level < 70) rarity = 3;
        if (this.level < 30) rarity = 2;
        if (this.level < 10) rarity = 1;
        return Math.max(rarity, this.initialRarity());
    }

    initialRarity(): Rarity {
        return this.sangvisInfo.rank - 2;
    }

    maxSkillOneTwo(): number {
        return CoalitionUnitType.Ringleader == this.type() ? 10 : 5;
    }

    cost(): number {
        return this.sangvisInfo.ap_cost;
    }

    chibi(): string | undefined {
        let code = this.sangvisInfo.code?.toLowerCase();
        if (!code) return undefined;

        if (CoalitionUnitType.Ringleader === this.type()) code = `boss${code}`;
        return getStaticPath(path.join('chibi', code, `${code}.png`));
    }

    profilePic(): string | undefined {
        const code = this.findFromSangvisInfo()?.code?.toLowerCase();
        if (!code) return undefined;

        return getStaticPath(path.join('profile-pic', `pic_${code}_ss.png`));
    }

    type(): CoalitionUnitType | undefined {
        return this.sangvisInfo.type;
    }

    maxAffection(): number {
        if (this._oathed) return 150;
        return 100;
    }

    minLevel(): number {
        return 1;
    }

    maxLevel(): number {
        return 100;
    }

    maxDummies(): number | undefined {
        return 5;
    }

    exp(): number {
        return sangvisExpInfo.filter(sangvisExpInfo => sangvisExpInfo.lv < this.level)
                             .map(sangvisExpInfo => sangvisExpInfo.exp)
                             .reduce((a, b) => a + b, 0);
    }

    life(): number {
        const ratioHp = this.sangvisInfo.ratio_hp;
        const eatRatio = this.sangvisInfo.eat_ratio;
        const dummies = this.dummies;
        const formation = this.sangvisInfo.formation;
        const resolutionGroupId = this.sangvisInfo.resolution;
        const resolutionHp = sangvisResolutionInfo.find(sangvisResolutionInfo => sangvisResolutionInfo.group_id == resolutionGroupId && sangvisResolutionInfo.lv == this.dummies - 1)?.resolution_hp || 0;
        const basicHp = sangvisTypes[this.type()].basic_hp;
        const advanceHp = sangvisAdvances[this.rarity].advance_hp;
        const shapeMultiplier = sangvisShapes[this.size || 0];

        return ceil(((((sangvisBaseLevel + this.level - 1) * ratioHp * eatRatio * shapeMultiplier * advanceHp * basicHp) / 100_000_000) / formation + resolutionHp) * Math.min(dummies, formation));
    }

    private findFromSangvisInfo() {
        return sangvisInfo.find(sangvisInfoElement => this.id === sangvisInfoElement.id);
    }

}
