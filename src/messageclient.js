
const { AbstractEventObject } = require('jsevent');

/**
 * IPC 消息的客户端
 *
 * 接收到消息时会触发事件，事件的名称由 MessageServer 和
 * MessageClient 协定。
 * 事件携带一个 data 对象。
 */
class MessageClient extends AbstractEventObject {

    constructor(abstractClientWindowIPC) {
        super();
        this.abstractClientWindowIPC = abstractClientWindowIPC;
        this.bindEvents();
    }

    send(messageName, messageData) {
        this.abstractClientWindowIPC.send(messageName, messageData);
    }

    bindEvents() {
        this.abstractClientWindowIPC.addEventListener('messageReceived', (args) => {
            let messageName = args.name;
            let messageData = args.data;
            this.dispatch(messageName, messageData);
        });
    }
}

module.exports = MessageClient;