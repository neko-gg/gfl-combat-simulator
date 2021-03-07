/* eslint-disable @typescript-eslint/no-var-requires */
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
    entry: ['./src/main.ts'],
    devtool: 'source-map',
    module: {
        rules: require('./webpack.rules')
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
        alias: require('./webpack.aliases')
    },
    plugins: [new FileManagerPlugin(
        {
            events: {
                onEnd: {
                    copy: [
                        {source: 'src/static/', destination: `.webpack/renderer/main_window/static/`}
                    ]
                }
            }
        })]
};
