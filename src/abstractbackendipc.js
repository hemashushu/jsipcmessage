const { ImmutableEventObject } = require('jsevent');

/**
 * IPC Server
 *
 * 当 IPC Server 接收到新消息时，会触发 messageReceived 事件。
 *
 * 事件携带一个 {sender, name, data} 对象，其中 sender 是消息的发送者（Client），
 * name 是消息类型名称，data 是消息具体内容，
 * name 和 data 的实际内容由 AbstractBackendIPC 跟 AbstractClientWindowIPC 协定。
 */
class AbstractBackendIPC extends ImmutableEventObject {

    constructor() {
        super(['messageReceived']);
    }

    /**
     * 向 client 发送消息
     *
     * @param {*} receiver
     * @param {*} messageName
     * @param {*} messageData
     */
    send(receiver, messageName, messageData) {
        //
    }

    /**
     * 收到 client 发送过来的消息
     *
     * @param {*} sender
     * @param {*} messageName
     * @param {*} messageData
     */
    messageReceived(sender, messageName, messageData) {
        super.dispatch('messageReceived',
            {
                sender: sender,
                name: messageName,
                data: messageData
            });
    }
}

module.exports = AbstractBackendIPC;