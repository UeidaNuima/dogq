import Bot from '.';
import {
  RecvMessage,
  SendPrivateMessage,
  SendGroupMessage,
  SendDiscussMessage,
} from './cqsdk';

/**
 * Context class for a message.
 */
export class Context {
  [name: string]: any;
  public bot: Bot;
  public message: RecvMessage;
  public match: any[];

  constructor(bot: Bot, message: RecvMessage) {
    this.bot = bot;
    this.message = message;
  }

  /**
   * Reply to the sender.
   * @param text reply text
   */
  public reply(text: string) {
    switch (this.message.type) {
      case 'RecvPrivateMessage':
        this.bot.send({
          type: 'SendPrivateMessage',
          QQ: this.message.QQ,
          text,
        } as SendPrivateMessage);
        return;
      case 'RecvGroupMessage':
        this.bot.send({
          type: 'SendGroupMessage',
          QQ: this.message.QQ,
          group: this.message.group,
          text,
        } as SendGroupMessage);
        return;
      case 'RecvDiscussMessage':
        this.bot.send({
          type: 'SendDiscussMessage',
          QQ: this.message.QQ,
          discuss: this.message.discuss,
          text,
        } as SendDiscussMessage);
        return;
      default:
        this.bot.logger.error('Replied unreplyable message.');
    }
  }
}
