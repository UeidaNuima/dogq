"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
/**
 * Log level definition.
 */
var Level;
(function (Level) {
    Level[Level["ALL"] = 0] = "ALL";
    Level[Level["DEBUG"] = 1] = "DEBUG";
    Level[Level["INFO"] = 2] = "INFO";
    Level[Level["WARN"] = 3] = "WARN";
    Level[Level["ERROR"] = 4] = "ERROR";
    Level[Level["OFF"] = 5] = "OFF";
})(Level = exports.Level || (exports.Level = {}));
class Logger {
    constructor(level = Level.INFO) {
        this.debug = this.log.bind(this, Level.DEBUG);
        this.info = this.log.bind(this, Level.INFO);
        this.warn = this.log.bind(this, Level.WARN);
        this.error = this.log.bind(this, Level.ERROR);
        this.logLevel = level;
    }
    log(level, message) {
        if (this.logLevel <= level) {
            let castColor;
            switch (level) {
                case Level.DEBUG:
                    castColor = chalk_1.default.green.bold('DEBUG');
                    break;
                case Level.INFO:
                    castColor = chalk_1.default.cyan.bold('INFO');
                    break;
                case Level.WARN:
                    castColor = chalk_1.default.yellow.bold('WARN');
                    break;
                case Level.ERROR:
                    castColor = chalk_1.default.red.bold('ERROR');
                    break;
                default:
                    castColor = chalk_1.default.gray.bold('UNKNOWN');
            }
            console.log(`[${castColor}] ${chalk_1.default.grey(new Date().toLocaleString())} ${message}`);
        }
    }
}
exports.Logger = Logger;
