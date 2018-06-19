"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Context class for a message.
 */
class Context {
    constructor(bot, message) {
        this.bot = bot;
        this.message = message;
    }
    /**
     * Reply to the sender.
     * @param text reply text
     */
    reply(text) {
        switch (this.message.type) {
            case 'RecvPrivateMessage':
                this.bot.send({
                    type: 'SendPrivateMessage',
                    QQ: this.message.QQ,
                    text,
                });
                return;
            case 'RecvGroupMessage':
                this.bot.send({
                    type: 'SendGroupMessage',
                    QQ: this.message.QQ,
                    group: this.message.group,
                    text,
                });
                return;
            case 'RecvDiscussMessage':
                this.bot.send({
                    type: 'SendDiscussMessage',
                    QQ: this.message.QQ,
                    discuss: this.message.discuss,
                    text,
                });
                return;
            default:
                this.bot.logger.error('Replied unreplyable message.');
        }
    }
}
exports.Context = Context;
