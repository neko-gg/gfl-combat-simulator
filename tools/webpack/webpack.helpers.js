/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const cwd = process.cwd();

const createWebpackAliases = (als) => {
    const result = {};
    for (const name in als) {
        result[name] = path.join(cwd, als[name]);
    }
    return result;
};

module.exports = { createWebpackAliases };
