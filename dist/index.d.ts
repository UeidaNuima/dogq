/// <reference types="koa-compose" />
import { Logger, Level } from './logger';
import { Context } from './context';
import * as cq from './cqsdk';
import { Middleware } from 'koa-compose';
/**
 * Constructor config interface.
 */
export interface Config {
    targetServerPort?: number;
    selfServerPort?: number;
    logLevel?: Level;
}
export interface Matcher {
    type?: RegExp | string;
    QQ?: RegExp | string;
    groupID?: RegExp | string;
    discussID?: RegExp | string;
    operatedQQ?: RegExp | string;
    text?: RegExp | string;
}
/**
 * The main bot class.
 */
declare class Bot {
    logger: Logger;
    context: object;
    private middleware;
    private server;
    private client;
    private targetServerPort;
    private selfServerPort;
    constructor(config?: Config);
    /**
     * Send message to coolq host.
     * @param message message string that will be sent
     */
    send(message: cq.SentMessage): void;
    /**
     * Add a middleware.
     * @param middleware middleware function
     */
    use(middleware: Middleware<Context>): void;
    /**
     * Add a match middleware.
     * @param filter filter conditions
     * @param middleware middleware function
     */
    on(matcher: Matcher, middleware: Middleware<Context>): void;
    /**
     * Start the server.
     */
    start(): void;
}
export * from './cqsdk';
export * from './logger';
export * from './context';
export { Middleware };
export default Bot;
