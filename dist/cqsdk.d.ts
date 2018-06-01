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
export interface SentPrivateMessage {
    type: 'SentPrivateMessage';
    QQ: string;
    text: string;
}
export interface SentGroupMessage {
    type: 'SentGroupMessage';
    group: string;
    text: string;
}
export interface SentDiscussMessage {
    type: 'SentDiscussMessage';
    discuss: string;
    text: string;
}
/**
 * Connection heart beat.
 */
export interface SentClientHello {
    type: 'SentClientHello';
    port: number;
}
/**
 * Kick a qq from a group. Only avaliable for admins.
 */
export interface SentGroupKick {
    type: 'SentGroupKick';
    group: string;
    QQ: string;
    reject: boolean;
}
/**
 * Ban a qq from a group. Only avaliable for admins.
 */
export interface SentGroupBan {
    type: 'SentGroupBan';
    group: string;
    QQ: string;
    duration: number;
}
/**
 * Whole group ban. Only avaliable for admins.
 */
export interface SentGroupWholeBan {
    type: 'SentGroupWholeBan';
    group: string;
    enable: boolean;
}
/**
 * Set a qq's group card name.
 */
export interface SentGroupCard {
    type: 'SentGroupCard';
    group: string;
    QQ: string;
    card: string;
}
export interface SentAppDirectory {
    type: 'AppDirectory';
}
export declare type SentMessage = SentPrivateMessage | SentGroupMessage | SentDiscussMessage | SentClientHello | SentGroupKick | SentGroupBan | SentGroupWholeBan | SentGroupCard | SentAppDirectory;
/**
 * Encode message object to raw message.
 * @param message sent message object
 */
export declare function encodeMessage(message: SentMessage): string;
