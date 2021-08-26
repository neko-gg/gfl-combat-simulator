import {ipcMain} from 'electron';
import {changePort} from "@app/web/proxy";
import state from "@app/state/state";
import Echelon from "@app/model/Echelon";
import TDoll from "@app/model/TDoll";
import Equip from "@app/model/Equip";
import Fairy from "@app/model/Fairy";
import HOC from "@app/model/HOC";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";
import {StrategyFairySkillInfoPacket} from "@app/model/StrategyFairySkill";
import CoalitionEchelon from "@app/model/CoalitionEchelon";
import CoalitionUnit from "@app/model/CoalitionUnit";

export default function setupIpcListeners(): void {
    ipcMain.on('echelon-updated', (event, arg: Echelon) => {
        arg.tDollsInEchelon
           .filter(tDollInEchelon => tDollInEchelon?.tDoll)
           .forEach(tDollInEchelon => {
               tDollInEchelon.tDoll = Object.assign(new TDoll(tDollInEchelon.tDoll.id), tDollInEchelon.tDoll);
               tDollInEchelon.tDoll.equipOne = tDollInEchelon.tDoll.equipOne ? Object.assign(new Equip(tDollInEchelon.tDoll.equipOne.id), tDollInEchelon.tDoll.equipOne) : undefined;
               tDollInEchelon.tDoll.equipTwo = tDollInEchelon.tDoll.equipTwo ? Object.assign(new Equip(tDollInEchelon.tDoll.equipTwo.id), tDollInEchelon.tDoll.equipTwo) : undefined;
               tDollInEchelon.tDoll.equipThree = tDollInEchelon.tDoll.equipThree ? Object.assign(new Equip(tDollInEchelon.tDoll.equipThree.id), tDollInEchelon.tDoll.equipThree) : undefined;
           });

        if (arg.fairyInEchelon?.fairy) {
            arg.fairyInEchelon.fairy = Object.assign(new Fairy(arg.fairyInEchelon.fairy.id), arg.fairyInEchelon.fairy);
        }

        state.Instance.echelon = arg;
    });

    ipcMain.on('coalition-echelon-updated', (event, arg: CoalitionEchelon) => {
        arg.unitsInEchelon
           .filter(unitInEchelon => unitInEchelon?.coalitionUnit)
           .forEach(unitInEchelon => unitInEchelon.coalitionUnit = Object.assign(new CoalitionUnit(unitInEchelon.coalitionUnit.id), unitInEchelon.coalitionUnit));

        state.Instance.coalitionEchelon = Object.assign(new CoalitionEchelon(arg.unitsInEchelon), arg);
    });

    ipcMain.on('selected-echelon-type-updated', (event, arg: "griffin" | "coalition") => {
        state.Instance.selectedEchelonType = arg;
    });

    ipcMain.on('enemy-updated', (event, arg: { enemyTeamId: number, enemyBossHp: number }) => {
        state.Instance.enemyTeamId = arg.enemyTeamId;
        state.Instance.enemyBossHp = arg.enemyBossHp;
    });

    ipcMain.on('is-day-updated', (event, arg: boolean) => {
        state.Instance.isDay = arg;
    });

    ipcMain.on('proxy-port-updated', (event, arg: number) => {
        state.Instance.proxyPort = arg;
        changePort(arg);
    });

    ipcMain.on('node-belongs-to-updated', (event, arg: NodeBelongsTo) => {
        state.Instance.nodeBelongsTo = arg;
    });

    ipcMain.on('fairy-skill-on-team-updated', (event, arg: StrategyFairySkillInfoPacket | undefined) => {
        state.Instance.fairySkillsOnTeam = arg || [];
    });

    ipcMain.on('fairy-skill-on-enemy-updated', (event, arg: StrategyFairySkillInfoPacket | undefined) => {
        state.Instance.fairySkillsOnEnemy = arg || [];
    });

    ipcMain.on('hocs-updated', (event, arg: HOC[]) => {
        state.Instance.hocs = arg.map(hoc => Object.assign(HOC.clone(hoc), hoc));
    });
}
