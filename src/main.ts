import {app, BrowserWindow, dialog, ipcMain, protocol} from 'electron';
import axios, {AxiosResponse} from "axios";
import {changePort, startProxy} from "@app/web/proxy";
import logger from "@app/utils/logger"
import {inDev} from "@app/utils/dev";
import state from "@app/state/state";
import Echelon from "@app/model/Echelon";
import TDoll from "@app/model/TDoll";
import Equip from "@app/model/Equip";
import Fairy from "@app/model/Fairy";
import HOC from "@app/model/HOC";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";
import {StrategyFairySkillInfoPacket} from "@app/model/StrategyFairySkill";
import {downloadPromise} from "@app/data/DownloadUtils";
import tmp from "tmp";
import * as childProcess from 'child_process'
import path from "path";
import semver from "semver";
import pjson from "../package.json";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
    app.quit();
}

const updateIfAvailable = (version: string, asset: { name: string, browser_download_url: string }) => {
    return new Promise<void>(resolve => {
        if (semver.gt(version, pjson.version)) {
            logger.debug("new version available");
            const dialogOptions = {
                buttons: ["Yes", "No"],
                message: "New version available. Do you want to update?"
            }
            dialog.showMessageBox(dialogOptions).then(response => {
                if (response.response === 0) {
                    logger.debug("user choose to update");
                    downloadAndRunInstaller(asset).then(() => resolve())
                } else {
                    logger.debug("user refused to update");
                    resolve();
                }
            });
        } else {
            logger.debug("latest version already installed");
            resolve();
        }
    });
}

const downloadAndRunInstaller = (asset: { name: string, browser_download_url: string }) => {
    return new Promise<void>((resolve, reject) => {
        if (!asset.browser_download_url) {
            reject(`empty setup download url: ${asset}`)
        } else {
            const tempDir = tmp.dirSync({prefix: 'gfl-combat-simulator-'});
            const tempDirPath = tempDir.name;
            const tempPath = path.resolve(tempDirPath, asset.name)

            logger.debug("downloading installer")
            downloadPromise(asset.browser_download_url, tempPath).then(setupExe => {
                logger.info("running installer")
                return childProcess.exec(setupExe,
                                         err => {
                                             if (err) {
                                                 reject(err)
                                             } else {
                                                 resolve();
                                             }
                                         });
            }).catch(err => reject(err));
        }
    });
}

const checkForUpdates = () => {
    logger.info("checking for updates");
    axios.get('https://api.github.com/repos/neko-gg/gfl-combat-simulator/releases/latest')
         .then((response: AxiosResponse<{ tag_name: string, assets: { name: string, browser_download_url: string }[] }>) => response.data)
         .then(data => ({...data, version: data.tag_name.replace(/v?(.*)/g, "$1")}))
         .then(data => ({...data, version: data.version.replace(/^([^\\.]*\.[^\\.]*)$/g, "$1.0")}))
         .then(data => updateIfAvailable(data.version, data.assets.find(asset => asset.name.endsWith("-setup.exe"))));
};
checkForUpdates();

logger.info(`starting gfl-combat-simulator${inDev ? ' in development mode' : ''}`);

const createWindow = (): void => {
    const mainWindow = new BrowserWindow({
                                             width: 840,
                                             height: 600,
                                             minHeight: 600,
                                             minWidth: 720,
                                             backgroundColor: '#242424',
                                             show: false,
                                             webPreferences: {
                                                 nodeIntegration: true,
                                                 contextIsolation: false,
                                                 webSecurity: !inDev,
                                                 preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
                                             },
                                         });

    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.on('ready-to-show', () => mainWindow.show());

    if (!inDev) {
        mainWindow.removeMenu();
    }

    logger.debug("starting proxy");
    startProxy((error, port) => {
        if (error?.message?.includes('EADDRINUSE')) {
            mainWindow.webContents.send('proxy-port-already-in-use', port);
        }
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        logger.info("quitting gfl-combat-simulator");
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        logger.silly("creating window");
        createWindow();
    }
});

app.whenReady().then(() => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURIComponent(request.url.replace('file:///', ''));
        callback(pathname);
    });
});

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
