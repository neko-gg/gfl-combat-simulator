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
            dirname: "./log",
            filename: "%DATE%"
        })
    ]
});

export default logger;
