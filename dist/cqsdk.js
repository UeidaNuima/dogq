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
        case 'SendPrivateMessage':
            return `PrivateMessage ${message.QQ} ${encodeString(message.text)}`;
        case 'SendGroupMessage':
            return `GroupMessage ${message.group} ${encodeString(message.text)}`;
        case 'SendDiscussMessage':
            return `DiscussMessage ${message.discuss} ${encodeString(message.text)}`;
        case 'SendClientHello':
            return `ClientHello ${message.port}`;
        case 'SendGroupKick':
            return `GroupKick ${message.group} ${message.QQ} ${message.reject ? 1 : 0}`;
        case 'SendGroupBan':
            return `GroupBan ${message.group} ${message.QQ} ${message.duration *
                1000}`;
        case 'SendGroupWholeBan':
            return `GroupWholeBan ${message.group} ${message.enable ? 1 : 0}`;
        case 'SendGroupCard':
            return `GroupCard ${message.group} ${message.QQ} ${encodeString(message.card)}`;
        default:
            return 'UnknownMessage';
    }
}
exports.encodeMessage = encodeMessage;
class CQMagic {
}
exports.CQMagic = CQMagic;
class CQImage extends CQMagic {
    constructor(image) {
        super();
        this.image = image;
    }
    toString() {
        return `[CQ:image,file=${this.image}]`;
    }
}
CQImage.PATTERN = /\[CQ:image,file=(.+?)\]/;
exports.CQImage = CQImage;
class CQAt extends CQMagic {
    constructor(QQ) {
        super();
        this.QQ = QQ;
    }
    toString() {
        return `[CQ:at,qq=${this.QQ}]`;
    }
}
CQAt.PATTERN = /\[CQ:at,qq=(\d+?)\]/;
exports.CQAt = CQAt;
