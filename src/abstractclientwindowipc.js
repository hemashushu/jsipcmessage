const { ImmutableEventObject } = require('jsevent');

/**
 * IPC Client
 *
 * 当 IPC Client 接收到新消息时，会触发 messageReceived 事件。
 *
 * 事件携带一个 {name, data} 对象，其中 name 是消息类型名称，data 是消息具体内容，
 * name 和 data 的实际内容由 AbstractBackendIPC 跟 AbstractClientWindowIPC 协定。
 */
class AbstractClientWindowIPC extends ImmutableEventObject {

    constructor() {
        super(['messageReceived']);
    }

    /**
     * 向 backend 发送消息
     * @param {*} messageName
     * @param {*} messageData
     */
    send(messageName, messageData) {
        //
    }

    /**
     * 收到 backend 发送过来的消息
     * @param {*} messageName
     * @param {*} messageData
     */
    messageReceived(messageName, messageData) {
        super.dispatch('messageReceived',
            {
                name: messageName,
                data: messageData
            });
    }
}

module.exports = AbstractClientWindowIPC;