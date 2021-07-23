/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const rootDir = process.cwd();
const fs = require('fs-extra');
const {spawn} = require('child_process');
const pjson = require('../../package.json');

module.exports = {
    packagerConfig: {
        asar: true
    },
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            platforms: ['win32'],
            config: {
                setupExe: `gfl-combat-simulator-${pjson.version}-setup.exe`
            }
        },
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'win32']
        },
        {
            name: '@electron-forge/maker-deb',
            config: {}
        },
        {
            name: '@electron-forge/maker-rpm',
            config: {}
        }
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: path.join(rootDir, 'tools/webpack/webpack.main.js'),
                renderer: {
                    config: path.join(rootDir, 'tools/webpack/webpack.renderer.js'),
                    entryPoints: [
                        {
                            rhmr: 'react-hot-loader/patch',
                            html: path.join(rootDir, 'src/index.html'),
                            js: path.join(rootDir, 'src/renderer.ts'),
                            name: 'main_window'
                        }
                    ]
                }
            }
        ]
    ],
    hooks: {
        readPackageJson: async (forgeConfig, packageJson) => {
            if (Object.keys(packageJson.dependencies).length === 0) {
                const originalPackageJson = await fs.readJson(path.resolve(__dirname, '../../package.json'));
                const webpackConfigJs = require('../webpack/webpack.renderer.js');
                Object.keys(webpackConfigJs.externals).forEach(pkg => {
                    packageJson.dependencies[pkg] = originalPackageJson.dependencies[pkg];
                });
            }
            return packageJson;
        },

        packageAfterPrune: async (forgeConfig, buildPath) => {
            console.log(buildPath);
            return new Promise((resolve, reject) => {
                const npmInstall = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['install'], {
                    cwd: buildPath,
                    stdio: 'inherit'
                });

                npmInstall.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error('process finished with error code ' + code));
                    }
                });

                npmInstall.on('error', (error) => {
                    reject(error);
                });
            });
        }
    }
};
