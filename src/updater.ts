import semver from "semver";
import pjson from "../package.json";
import logger from "@app/utils/logger";
import {BrowserWindow, dialog} from "electron";
import tmp from "tmp";
import path from "path";
import {downloadPromise} from "@app/data/DownloadUtils";
import childProcess from "child_process";
import axios, {AxiosResponse} from "axios";
import ProgressBar from "electron-progressbar";

function askAndUpdateIfAvailable(browserWindow: BrowserWindow, version: string, asset: { name: string, browser_download_url: string }) {
    return new Promise<void>((resolve, reject) => {
        if (semver.gt(version, pjson.version)) {
            logger.debug("new version available");
            const dialogOptions = {
                buttons: ["Yes", "No"],
                message: "New version available. Do you want to update?"
            }
            dialog.showMessageBox(browserWindow, dialogOptions).then(response => {
                if (response.response === 0) {
                    logger.debug("user choose to update");
                    downloadAndRunInstaller(browserWindow, asset).then(() => resolve()).catch(reject);
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

function downloadAndRunInstaller(browserWindow: BrowserWindow, asset: { name: string, browser_download_url: string }) {
    return new Promise<void>((resolve, reject) => {
        if (!asset.browser_download_url) {
            reject(`empty setup download url: ${asset}`)
        } else {
            const tempDir = tmp.dirSync({prefix: 'gfl-combat-simulator-'});
            const tempDirPath = tempDir.name;
            const tempPath = path.resolve(tempDirPath, asset.name)

            const progressBarOptions = {
                indeterminate: false,
                title: "GFL Combat Simulator",
                text: 'Downloading installer...',
                detail: 'Please wait while the new installer is downloading.',
                maxValue: 1,
                browserWindow: {
                    parent: browserWindow
                }
            };
            const progressBar = new ProgressBar(progressBarOptions);
            const onProgess = (progress: number) => {
                progressBar.text = `Downloading installer... ${Math.floor(progress * 100)}%`;
                progressBar.value = progress;
            };

            logger.debug("downloading installer")
            downloadPromise(asset.browser_download_url, tempPath, onProgess).then(setupExe => {
                logger.info("running installer")
                return childProcess.exec(setupExe,
                                         err => {
                                             if (err) {
                                                 reject(err);
                                             } else {
                                                 resolve();
                                             }
                                         });
            }).catch(err => reject(err));
        }
    });
}

export function checkForUpdates(browserWindow: BrowserWindow): void {
    logger.info("checking for updates");
    axios.get('https://api.github.com/repos/neko-gg/gfl-combat-simulator/releases/latest')
         .then((response: AxiosResponse<{ tag_name: string, assets: { name: string, browser_download_url: string }[] }>) => response.data)
         .then(data => ({...data, version: data.tag_name.replace(/v?(.*)/g, "$1")}))
         .then(data => ({...data, version: data.version.replace(/^([^\\.]*\.[^\\.]*)$/g, "$1.0")}))
         .then(data => askAndUpdateIfAvailable(browserWindow, data.version, data.assets.find(asset => asset.name.endsWith("-setup.exe"))))
         .catch(err => logger.error('failed to update:', err));
}
