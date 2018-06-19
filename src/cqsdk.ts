import * as iconv from 'iconv-lite';

function decodeString(str: string) {
  return iconv.decode(Buffer.from(str, 'base64'), 'gb18030');
}

function encodeString(str: string) {
  return Buffer.from(iconv.encode(str, 'gb18030')).toString('base64');
}

export interface RecvPrivateMessage {
  type: 'RecvPrivateMessage';
  QQ: string;
  text: string;
  message: string;
}

export interface RecvGroupMessage {
  type: 'RecvGroupMessage';
  QQ: string;
  group: string;
  text: string;
  message: string;
}

export interface RecvDiscussMessage {
  type: 'RecvDiscussMessage';
  QQ: string;
  discuss: string;
  text: string;
  message: string;
}

export interface RecvGroupMemberDecrease {
  type: 'RecvGroupMemberDecrease';
  group: string;
  QQ: string;
  operatedQQ: string;
  message: string;
}

export interface RecvGroupMemberIncrease {
  type: 'RecvGroupMemberIncrease';
  group: string;
  QQ: string;
  operatedQQ: string;
  message: string;
}

export interface RecvUnknownMessage {
  type: 'RecvUnknownMessage';
  message: string;
}

export type RecvMessage =
  | RecvPrivateMessage
  | RecvGroupMessage
  | RecvDiscussMessage
  | RecvGroupMemberDecrease
  | RecvGroupMemberIncrease
  | RecvUnknownMessage;

export type RecvReplyableMessage =
  | RecvPrivateMessage
  | RecvGroupMessage
  | RecvDiscussMessage;

/**
 * Decode raw message to an object
 * @param message base64 decoded message to be parsed
 */
export function decodeMessage(message: string) {
  const [messageType, ...payload] = message.split(' ');
  switch (messageType) {
    case 'PrivateMessage': {
      const [QQ, text] = payload;
      return {
        type: 'RecvPrivateMessage',
        QQ,
        text: decodeString(text),
        message,
      } as RecvPrivateMessage;
    }
    case 'GroupMessage': {
      const [group, QQ, text] = payload;
      return {
        type: 'RecvGroupMessage',
        group,
        QQ,
        text: decodeString(text),
        message,
      } as RecvGroupMessage;
    }
    case 'DiscussMessage': {
      const [discuss, QQ, text] = payload;
      return {
        type: 'RecvDiscussMessage',
        discuss,
        QQ,
        text: decodeString(text),
        message,
      } as RecvDiscussMessage;
    }
    case 'GroupMemberDecrease': {
      const [group, QQ, operatedQQ] = payload;
      return {
        type: 'RecvGroupMemberDecrease',
        group,
        QQ,
        operatedQQ,
        message,
      } as RecvGroupMemberDecrease;
    }
    case 'GroupMemberIncrease': {
      const [group, QQ, operatedQQ] = payload;
      return {
        type: 'RecvGroupMemberIncrease',
        group,
        QQ,
        operatedQQ,
        message,
      } as RecvGroupMemberIncrease;
    }
    default: {
      return {
        type: 'RecvUnknownMessage',
        message,
      } as RecvUnknownMessage;
    }
  }
}

export interface SendPrivateMessage {
  type: 'SendPrivateMessage';
  QQ: string;
  text: string;
}

export interface SendGroupMessage {
  type: 'SendGroupMessage';
  group: string;
  text: string;
}

export interface SendDiscussMessage {
  type: 'SendDiscussMessage';
  discuss: string;
  text: string;
}

/**
 * Connection heart beat.
 */
export interface SendClientHello {
  type: 'SendClientHello';
  port: number;
}

/**
 * Kick a qq from a group. Only avaliable for admins.
 */
export interface SendGroupKick {
  type: 'SendGroupKick';
  group: string;
  QQ: string;
  // whether reject the qq request to join the group again
  reject: boolean;
}

/**
 * Ban a qq from a group. Only avaliable for admins.
 */
export interface SendGroupBan {
  type: 'SendGroupBan';
  group: string;
  QQ: string;
  // second
  duration: number;
}

/**
 * Whole group ban. Only avaliable for admins.
 */
export interface SendGroupWholeBan {
  type: 'SendGroupWholeBan';
  group: string;
  enable: boolean;
}

/**
 * Set a qq's group card name.
 */
export interface SendGroupCard {
  type: 'SendGroupCard';
  group: string;
  QQ: string;
  card: string;
}

export interface SendAppDirectory {
  type: 'AppDirectory';
}

// TODO: GroupAnonymousBan
// TODO: GroupSpecialTitle
// TODO: ...why so many there?

export type SendMessage =
  | SendPrivateMessage
  | SendGroupMessage
  | SendDiscussMessage
  | SendClientHello
  | SendGroupKick
  | SendGroupBan
  | SendGroupWholeBan
  | SendGroupCard
  | SendAppDirectory;

/**
 * Encode message object to raw message.
 * @param message sent message object
 */
export function encodeMessage(message: SendMessage) {
  switch (message.type) {
    case 'SendPrivateMessage':
      return `PrivateMessage ${message.QQ} ${encodeString(message.text)}`;

    case 'SendGroupMessage':
      return `GroupMessage ${message.group} ${encodeString(message.text)}`;

    case 'SendDiscussMessage':
      return `DiscussMessage ${message.discuss} ${encodeString(message.text)}`;

    case 'SendClientHello':
      return `ClientHello ${message.port}`;

    case 'SendGroupKick':
      return `GroupKick ${message.group} ${message.QQ} ${
        message.reject ? 1 : 0
      }`;

    case 'SendGroupBan':
      return `GroupBan ${message.group} ${message.QQ} ${message.duration *
        1000}`;

    case 'SendGroupWholeBan':
      return `GroupWholeBan ${message.group} ${message.enable ? 1 : 0}`;

    case 'SendGroupCard':
      return `GroupCard ${message.group} ${message.QQ} ${encodeString(
        message.card,
      )}`;

    default:
      return 'UnknownMessage';
  }
}

export abstract class CQMagic {
  public static PATTERN: RegExp;
  public abstract toString(): string;
}

export class CQImage extends CQMagic {
  private image: string;
  public static PATTERN = /\[CQ:image,file=(.+?)\]/;
  constructor(image: string) {
    super();
    this.image = image;
  }
  public toString() {
    return `[CQ:image,file=${this.image}]`;
  }
}

export class CQAt extends CQMagic {
  private QQ: string;
  public static PATTERN = /\[CQ:at,qq=(\d+?)\]/;
  constructor(QQ: string) {
    super();
    this.QQ = QQ;
  }
  public toString() {
    return `[CQ:at,qq=${this.QQ}]`;
  }
}
