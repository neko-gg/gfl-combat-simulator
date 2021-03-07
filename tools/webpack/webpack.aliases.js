// eslint-disable-next-line @typescript-eslint/no-var-requires
const {createWebpackAliases} = require('./webpack.helpers');

const aliases = createWebpackAliases({
    '@src': 'src',
    '@app': 'src/app',
    '@static': 'src/static',
});

module.exports = aliases;
