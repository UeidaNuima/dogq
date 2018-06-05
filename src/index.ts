import { Logger, Level } from './logger';
import { Context } from './context';
import { createSocket, Socket } from 'dgram';
import * as cq from './cqsdk';
import * as compose from 'koa-compose';
import * as util from 'util';
import { Middleware } from 'koa-compose';

/**
 * Constructor config interface.
 */
export interface Config {
  targetServerPort?: number;
  selfServerPort?: number;
  logLevel?: Level;
  debug?: boolean;
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
class Bot {
  public logger: Logger;
  public context: { [k: string]: any } = {};
  private middleware: Array<Middleware<Context>> = [];
  private server: Socket = createSocket('udp4');
  private client: Socket = createSocket('udp4');
  private targetServerPort: number;
  private selfServerPort: number;
  private debug: boolean;

  constructor(config: Config = {}) {
    const {
      targetServerPort = 11235,
      selfServerPort = 12450,
      logLevel,
      debug = false,
    } = config;
    this.targetServerPort = targetServerPort;
    this.selfServerPort = selfServerPort;
    this.logger = new Logger(debug ? Level.DEBUG : logLevel);
    this.debug = debug;
  }

  /**
   * Send message to coolq host.
   * @param message message string that will be sent
   */
  public send(message: cq.SentMessage) {
    // log the send message
    this.logger.debug(`↗ ${util.inspect(message, undefined, null, true)}`);
    // messages won't be sent in debug mode
    if (this.debug) {
      return;
    }
    // encode the message and send
    const encodedMessage = cq.encodeMessage(message);
    this.client.send(
      encodedMessage,
      this.targetServerPort,
      'localhost',
      err => {
        // err will be Error or null
        if (err) {
          this.logger.error(err.message);
        }
      },
    );
  }

  /**
   * Add a middleware.
   * @param middleware middleware function
   */
  public use(middleware: Middleware<Context>) {
    this.middleware.push(middleware);
  }

  /**
   * Add a match middleware.
   * @param filter filter conditions
   * @param middleware middleware function
   */
  public on(
    matcher: Matcher | ((message: cq.RecvMessage) => boolean),
    middleware: Middleware<Context>,
  ) {
    this.middleware.push(async (ctx: Context, next: () => Promise<any>) => {
      let matched = true;
      if (matcher instanceof Function) {
        matched = matcher(ctx.message);
      } else {
        Object.keys(matcher).forEach(key => {
          if (
            ctx.message[key] &&
            matcher[key] &&
            ctx.message[key] !== matcher[key]
          ) {
            let pattern = matcher[key];
            if (typeof pattern === 'string') {
              pattern = new RegExp(pattern);
            }
            const match = ctx.message[key].match(pattern);
            if (match) {
              if (key === 'text') {
                Object.assign(ctx, { match });
              }
            } else {
              matched = false;
            }
          } else {
            matched = false;
          }
        });
      }
      if (matched) {
        await middleware(ctx, next);
      } else {
        await next();
      }
    });
  }

  /**
   * Start the server.
   */
  public start() {
    // compose all the middlewares
    const fn = compose(this.middleware);

    this.logger.info(`Server is listening at :${this.selfServerPort}`);
    this.server.on('message', (msg: Buffer) => {
      // decode message
      const message = cq.decodeMessage(msg.toString());
      // create context
      const ctx = new Context(this, message);
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

    this.server.on('error', (err: any) => {
      if (err.errno === 'EADDRINUSE') {
        // exit when port is busy
        this.logger.error(`The port ${this.selfServerPort} was busy.`);
        this.server.close();
        process.exit(1);
      } else {
        // otherwise just log the error and continue
        this.logger.error(err.message);
      }
    });

    // start the server
    this.server.bind(this.selfServerPort);
  }
}

exports = module.exports = Bot; // a hack for both typescript and node
export * from './cqsdk';
export * from './logger';
export * from './context';
export { Middleware };
export default Bot;
