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
export declare type RecvMessage = RecvPrivateMessage | RecvGroupMessage | RecvDiscussMessage | RecvGroupMemberDecrease | RecvGroupMemberIncrease | RecvUnknownMessage;
export declare type RecvReplyableMessage = RecvPrivateMessage | RecvGroupMessage | RecvDiscussMessage;
/**
 * Decode raw message to an object
 * @param message base64 decoded message to be parsed
 */
export declare function decodeMessage(message: string): RecvPrivateMessage | RecvGroupMessage | RecvDiscussMessage | RecvGroupMemberDecrease | RecvGroupMemberIncrease | RecvUnknownMessage;
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
    reject: boolean;
}
/**
 * Ban a qq from a group. Only avaliable for admins.
 */
export interface SendGroupBan {
    type: 'SendGroupBan';
    group: string;
    QQ: string;
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
export declare type SendMessage = SendPrivateMessage | SendGroupMessage | SendDiscussMessage | SendClientHello | SendGroupKick | SendGroupBan | SendGroupWholeBan | SendGroupCard | SendAppDirectory;
/**
 * Encode message object to raw message.
 * @param message sent message object
 */
export declare function encodeMessage(message: SendMessage): string;
export declare abstract class CQMagic {
    static PATTERN: RegExp;
    abstract toString(): string;
}
export declare class CQImage extends CQMagic {
    private image;
    static PATTERN: RegExp;
    constructor(image: string);
    toString(): string;
}
export declare class CQAt extends CQMagic {
    private QQ;
    static PATTERN: RegExp;
    constructor(QQ: string);
    toString(): string;
}
