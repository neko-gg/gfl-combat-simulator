import {inDev} from "@app/utils/dev";

// https://github.com/webpack/webpack/issues/4175#issuecomment-342931035
const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

const winston = requireFunc("winston");
const {format} = requireFunc("logform");
const DailyRotateFile = requireFunc("winston-daily-rotate-file");

const loggingFormat = format.combine(
    format.timestamp(),
    format.printf(({level, message, timestamp}: { level: string, message: string, [timestamp: string]: unknown }) => `${timestamp} ${`[${level.toUpperCase()}]`.padStart(7, " ")}: ${message}`)
);

const logger = winston.createLogger({
    level: "silly",
    format: loggingFormat,
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            json: false,
            extension: ".log",
            dirname: inDev ? "./log" : `${process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")}/gfl-combat-simulator/log`,
            filename: "%DATE%"
        })
    ]
});

export default logger;
