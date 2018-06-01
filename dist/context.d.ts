import Bot from '.';
import { RecvMessage } from './cqsdk';
export default class Context {
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
