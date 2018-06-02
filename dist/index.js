"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const context_1 = require("./context");
const dgram_1 = require("dgram");
const cq = require("./cqsdk");
const compose = require("koa-compose");
/**
 * The main bot class.
 */
class Bot {
    constructor(config = {}) {
        this.context = {};
        this.middleware = [];
        this.server = dgram_1.createSocket('udp4');
        this.client = dgram_1.createSocket('udp4');
        const { targetServerPort = 11235, selfServerPort = 12450, logLevel, } = config;
        this.targetServerPort = targetServerPort;
        this.selfServerPort = selfServerPort;
        this.logger = new logger_1.Logger(logLevel);
    }
    /**
     * Send message to coolq host.
     * @param message message string that will be sent
     */
    send(message) {
        // encode the message and send
        const encodedMessage = cq.encodeMessage(message);
        // log the send message
        this.logger.debug(`↗ ${encodedMessage}`);
        this.client.send(encodedMessage, this.targetServerPort, 'localhost', err => {
            // err will be Error or null
            if (err) {
                this.logger.error(err.message);
            }
        });
    }
    /**
     * Add a middleware.
     * @param middleware middleware function
     */
    use(middleware) {
        this.middleware.push(middleware);
    }
    /**
     * Add a match middleware.
     * @param filter filter conditions
     * @param middleware middleware function
     */
    on(matcher, middleware) {
        this.middleware.push((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            let matched = true;
            if (matcher instanceof Function) {
                matched = matcher(ctx.message);
            }
            else {
                Object.keys(matcher).forEach(key => {
                    if (ctx.message[key] &&
                        matcher[key] &&
                        ctx.message[key] !== matcher[key]) {
                        let pattern = matcher[key];
                        if (typeof pattern === 'string') {
                            pattern = new RegExp(pattern);
                        }
                        const match = ctx.message[key].match(pattern);
                        if (match) {
                            if (key === 'text') {
                                Object.assign(ctx, { match });
                            }
                        }
                        else {
                            matched = false;
                        }
                    }
                    else {
                        matched = false;
                    }
                });
            }
            if (matched) {
                yield middleware(ctx, next);
            }
            else {
                yield next();
            }
        }));
    }
    /**
     * Start the server.
     */
    start() {
        // compose all the middlewares
        const fn = compose(this.middleware);
        this.logger.info(`Server is listening at :${this.selfServerPort}`);
        this.server.on('message', (msg) => {
            // decode message
            const message = cq.decodeMessage(msg.toString());
            // create context
            const ctx = new context_1.Context(this, message);
            // assign user-defined context to ctx
            Object.assign(ctx, this.context);
            // log the receive message
            this.logger.debug(`↘ ${message.message}`);
            // response
            fn(ctx);
        });
        // heart beat for every 30 seconds
        this.send({ type: 'SentClientHello', port: this.selfServerPort });
        setInterval(() => {
            this.send({ type: 'SentClientHello', port: this.selfServerPort });
        }, 30000);
        this.server.on('error', (err) => {
            if (err.errno === 'EADDRINUSE') {
                // exit when port is busy
                this.logger.error(`The port ${this.selfServerPort} was busy.`);
                this.server.close();
                process.exit(1);
            }
            else {
                // otherwise just log the error and continue
                this.logger.error(err.message);
            }
        });
        // start the server
        this.server.bind(this.selfServerPort);
    }
}
exports = module.exports = Bot; // a hack for both typescript and node
__export(require("./cqsdk"));
__export(require("./logger"));
__export(require("./context"));
exports.default = Bot;
