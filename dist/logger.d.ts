/**
 * Log level definition.
 */
export declare enum Level {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5,
}
export declare class Logger {
    debug: any;
    info: any;
    warn: any;
    error: any;
    private logLevel;
    constructor(level?: Level);
    log(level: Level, message: string | number): void;
}
