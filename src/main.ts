import {app, BrowserWindow, protocol} from 'electron';
import {startProxy} from "@app/web/proxy";
import logger from "@app/utils/logger"
import {inDev} from "@app/utils/dev";
import {checkForUpdates} from "@src/updater";
import setupIpcListeners from "@src/ipc-listener";

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

    if (!inDev) {
        mainWindow.removeMenu();
    }

    logger.debug("starting proxy");
    startProxy((error, port) => {
        if (error?.message?.includes('EADDRINUSE')) {
            mainWindow.webContents.send('proxy-port-already-in-use', port);
        }
    });

    checkForUpdates(mainWindow);
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

setupIpcListeners();
