"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv = require("iconv-lite");
function decodeString(str) {
    return iconv.decode(Buffer.from(str, 'base64'), 'gb18030');
}
function encodeString(str) {
    return Buffer.from(iconv.encode(str, 'gb18030')).toString('base64');
}
/**
 * Decode raw message to an object
 * @param message base64 decoded message to be parsed
 */
function decodeMessage(message) {
    const [messageType, ...payload] = message.split(' ');
    switch (messageType) {
        case 'PrivateMessage': {
            const [QQ, text] = payload;
            return {
                type: 'RecvPrivateMessage',
                QQ,
                text: decodeString(text),
                message,
            };
        }
        case 'GroupMessage': {
            const [group, QQ, text] = payload;
            return {
                type: 'RecvGroupMessage',
                group,
                QQ,
                text: decodeString(text),
                message,
            };
        }
        case 'DiscussMessage': {
            const [discuss, QQ, text] = payload;
            return {
                type: 'RecvDiscussMessage',
                discuss,
                QQ,
                text: decodeString(text),
                message,
            };
        }
        case 'GroupMemberDecrease': {
            const [group, QQ, operatedQQ] = payload;
            return {
                type: 'RecvGroupMemberDecrease',
                group,
                QQ,
                operatedQQ,
                message,
            };
        }
        case 'GroupMemberIncrease': {
            const [group, QQ, operatedQQ] = payload;
            return {
                type: 'RecvGroupMemberIncrease',
                group,
                QQ,
                operatedQQ,
                message,
            };
        }
        default: {
            return {
                type: 'RecvUnknownMessage',
                message,
            };
        }
    }
}
exports.decodeMessage = decodeMessage;
/**
 * Encode message object to raw message.
 * @param message sent message object
 */
function encodeMessage(message) {
    switch (message.type) {
        case 'SentPrivateMessage':
            return `PrivateMessage ${message.QQ} ${encodeString(message.text)}`;
        case 'SentGroupMessage':
            return `GroupMessage ${message.group} ${encodeString(message.text)}`;
        case 'SentDiscussMessage':
            return `DiscussMessage ${message.discuss} ${encodeString(message.text)}`;
        case 'SentClientHello':
            return `ClientHello ${message.port}`;
        case 'SentGroupKick':
            return `GroupKick ${message.group} ${message.QQ} ${message.reject ? 1 : 0}`;
        case 'SentGroupBan':
            return `GroupBan ${message.group} ${message.QQ} ${message.duration *
                1000}`;
        case 'SentGroupWholeBan':
            return `GroupWholeBan ${message.group} ${message.enable ? 1 : 0}`;
        case 'SentGroupCard':
            return `GroupCard ${message.group} ${message.QQ} ${encodeString(message.card)}`;
        default:
            return 'UnknownMessage';
    }
}
exports.encodeMessage = encodeMessage;
