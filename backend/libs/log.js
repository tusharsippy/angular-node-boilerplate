const winston = require('winston');
const fs = require('fs');
const config = require('config');
const path = require('path');

const DailyRotateFile = require('winston-daily-rotate-file');
const cwd = process.cwd();
const env = process.env.NODE_ENV || config.get('env') || 'development';
const logDir = path.join(cwd, 'log');

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'info'
        }),
        new DailyRotateFile({
            filename: `${logDir}/-results.log`,
            timestamp: tsFormat,
            datePattern: 'yyyy-MM-dd',
            prepend: true,
            level: env === 'development' ? 'debug' : 'info'
        })
    ]
});

module.exports = logger;