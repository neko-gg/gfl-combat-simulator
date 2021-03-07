import Echelon from "@app/model/Echelon";
import TDollInEchelon from "@app/model/TDollInEchelon";
import TDoll from "@app/model/TDoll";
import {EchelonGridPosition} from "@app/model/EchelonGridPosition";
import {EchelonListPosition} from "@app/model/EchelonListPosition";
import Fairy from "@app/model/Fairy";
import FairyInEchelon from "@app/model/FairyInEchelon";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";


export default class State {

    private static _instance: State;

    private constructor() {
        // private
    }

    public static get Instance(): State {
        return this._instance || (this._instance = new this());
    }

    private _echelon = new Echelon([new TDollInEchelon(new TDoll(20_032), EchelonGridPosition.TOP_CENTER, EchelonListPosition.LEADER),
                                    new TDollInEchelon(new TDoll(20_103), EchelonGridPosition.MIDDLE_CENTER, EchelonListPosition.SECOND),
                                    new TDollInEchelon(new TDoll(205), EchelonGridPosition.TOP_LEFT, EchelonListPosition.THIRD),
                                    new TDollInEchelon(new TDoll(20_055), EchelonGridPosition.MIDDLE_LEFT, EchelonListPosition.FOURTH),
                                    new TDollInEchelon(new TDoll(20_057), EchelonGridPosition.BOTTOM_LEFT, EchelonListPosition.FIFTH)],
                                   new FairyInEchelon(new Fairy(11), true, true));

    private _enemyTeamId = 1544;
    private _isDay = true;
    private _proxyPort = 9002;
    private _nodeBelongsTo = NodeBelongsTo.WHITE;

    get echelon(): Echelon {
        return this._echelon;
    }

    set echelon(value: Echelon) {
        this._echelon = value;
    }

    get enemyTeamId(): number {
        return this._enemyTeamId;
    }

    set enemyTeamId(value: number) {
        this._enemyTeamId = value;
    }

    get isDay(): boolean {
        return this._isDay;
    }

    set isDay(value: boolean) {
        this._isDay = value;
    }

    get proxyPort(): number {
        return this._proxyPort;
    }

    set proxyPort(value: number) {
        this._proxyPort = value;
    }

    get nodeBelongsTo(): NodeBelongsTo {
        return this._nodeBelongsTo;
    }

    set nodeBelongsTo(value: NodeBelongsTo) {
        this._nodeBelongsTo = value;
    }

}
