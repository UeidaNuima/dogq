import Bot from '.';
import { RecvMessage } from './cqsdk';
/**
 * Context class for a message.
 */
export declare class Context {
    bot: Bot;
    message: RecvMessage;
    match: any[];
    constructor(bot: Bot, message: RecvMessage);
    /**
     * Reply to the sender.
     * @param text reply text
     */
    reply(text: string): void;
}
