/* eslint-disable @typescript-eslint/no-var-requires */
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const aliases = require('./webpack.aliases');

module.exports = {
    module: {
        rules,
    },
    plugins: plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            ...aliases,
        },
    },
    externals: {
        'winston': 'winston',
        'winston-daily-rotate-file': 'winston-daily-rotate-file'
    }
};
