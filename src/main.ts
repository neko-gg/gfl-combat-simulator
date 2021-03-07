import {app, BrowserWindow, ipcMain, protocol} from 'electron';
import {startServer} from '@app/web/server'
import {changePort, startProxy} from "@app/web/proxy";
import logger from "@app/utils/logger"
import {inDev} from "@app/utils/dev";
import state from "@app/state/state";
import Echelon from "@app/model/Echelon";
import TDoll from "@app/model/TDoll";
import Equip from "@app/model/Equip";
import Fairy from "@app/model/Fairy";
import {NodeBelongsTo} from "@app/model/NodeBelongsTo";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require('electron-squirrel-startup')) {
    app.quit();
}

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

    if(!inDev) {
        mainWindow.removeMenu();
    }

    logger.debug("starting proxy");
    startServer();
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

ipcMain.on('enemy-updated', (event, arg: number) => {
    state.Instance.enemyTeamId = arg;
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
