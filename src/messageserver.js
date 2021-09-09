const { AbstractEventObject } = require('jsevent');

/**
 * IPC 消息的服务端
 *
 * 接收到消息时会触发事件，事件的名称由 MessageServer 和
 * MessageClient 协定。
 * 事件携带一个 {sender, data} 对象，其中 sender 是消息客户端
 * 对象。
 */
class MessageServer extends AbstractEventObject {

    constructor(
        clientWindowListMaintainer,
        abstractClientWindowMessageSender,
        abstractBackendIPC) {
        super();

        this.clientWindowListMaintainer = clientWindowListMaintainer;
        this.abstractClientWindowMessageSender = abstractClientWindowMessageSender;
        this.abstractBackendIPC = abstractBackendIPC;

        this.bindEvents();
    }

    /**
     * 向 Client 发送消息
     *
     * @param {*} receiver
     * @param {*} messageName
     * @param {*} messageData
     */
    send(receiver, messageName, messageData) {
        // 在 Electron.js 应用里，receiver 是 webContents 对象。
        this.abstractBackendIPC.send(receiver, messageName, messageData);
    }

    /**
     * 向 Client 发送消息
     *
     * @param {*} clientWindow
     * @param {*} messageName
     * @param {*} messageData
     */
    sendByWindow(clientWindow, messageName, messageData) {
        // 在 Electron.js 应用里，clientWindow 是 BrowserWindow 对象。
        let sender = this.abstractClientWindowMessageSender.getSenderByClientWindow(clientWindow);
        this.send(sender, messageName, messageData);
    }

    /**
     * 向多个 Client 发送消息
     *
     * @param {*} receivers
     * @param {*} messageName
     * @param {*} messageData
     */
    sendMultiple(receivers, messageName, messageData) {
        for (let receiver of receivers) {
            this.send(receiver, messageName, messageData);
        }
    }

    /**
     * 向所有 Client 广播消息
     *
     * @param {*} messageName
     * @param {*} messageData
     */
    broadcast(messageName, messageData) {
        let receivers = [];
        for (let clientWindow of this.clientWindowListMaintainer.getAllAvailableClientWindows()) {
            let receiver = this.abstractClientWindowMessageSender.getSenderByClientWindow(clientWindow);
            receivers.push(receiver);
        }

        this.sendMultiple(receivers, messageName, messageData);
    }

    /**
     * 向除了指定的 Client 之外的所有 Client 广播消息
     *
     * @param {*} exceptReceiver
     * @param {*} messageName
     * @param {*} messageData
     */
    broadcastExcept(exceptReceiver, messageName, messageData) {
        let receivers = [];
        for (let clientWindow of this.clientWindowListMaintainer.getAllAvailableClientWindows()) {
            let recevier = this.abstractClientWindowMessageSender.getSenderByClientWindow(clientWindow);
            if (recevier !== exceptReceiver) {
                receivers.push(recevier);
            }
        }

        this.sendMultiple(receivers, messageName, messageData);
    }

    /**
     * 向 Client 发送一个提示性质的后端操作请求消息。
     *
     * 一般这种消息会出现在 UI 窗口的状态栏或者右下角的通知区域。
     * 用户可以选择不同的操作，也可以忽略。
     *
     * @param {*} receiver
     * @param {*} message 消息字符串
     * @param {*} actions 操作定义
     * @param {*} autoHideMilliseconds 消息自动隐藏的时间
     */
    sendBackendActionMessage(receiver,
        message,
        actions = [],
        autoHideMilliseconds = 0) {

        // actions: (可选)
        //      [{
        //          id: String,
        //          title: String, (可选)
        //          data: {}
        //      },... ]
        //
        // autoHideMilliseconds: (可选)
        //      UNDEFINED or 0 to disable auto hide

        this.send(receiver, 'backendActionMessage', {
            message: message,
            actions: actions,
            autoHideMilliseconds: autoHideMilliseconds
        });
    }

    /**
     * 向 Client 发送一个提示性质的后端操作请求消息。
     *
     * @param {*} clientWindow
     * @param {*} message
     * @param {*} actions
     * @param {*} autoHideMilliseconds
     */
    sendBackendActionMessageByWindow(clientWindow, message, actions, autoHideMilliseconds) {
        let receiver = this.abstractClientWindowMessageSender.getSenderByClientWindow(clientWindow);
        this.sendBackendActionMessage(receiver, message, actions, autoHideMilliseconds);
    }

    /**
     * 向 Client 发送一个提醒消息。
     *
     * 提醒消息是指比如无法完成用户的某个操作，或者某个操作失败等，但尚不属于应用程序错误等消息。
     * 一般这种消息会以 popup 方式醒目显示，且无需用户回应，消息需要用户点击之后才消失。
     *
     * @param {*} receiver
     * @param {*} iconClassName 字符串，提醒消息的图标类型（自定义）
     * @param {*} title 字符串，消息标题
     * @param {*} description 字符串，消息的详细描述
     * @param {*} hide Boolean，是否隐藏提醒消息。有时提醒消息可能会引导用户进行某种操作，当
     *     该操作被执行之后，可以向 Client 发送一个隐藏提醒消息的消息。
     */
    sendBackendNoticeMessage(receiver, iconClassName, title, description, hide = false) {
        this.send(receiver, 'backendNoticeMessage', {
            iconClassName: iconClassName,
            title: title,
            description: description,
            hide: hide
        });
    }

    /**
     * 向 Client 发送一个提醒消息。
     *
     * @param {*} clientWindow
     * @param {*} iconClassName
     * @param {*} title
     * @param {*} description
     * @param {*} hide
     */
    sendBackendNoticeMessageByWindow(clientWindow, iconClassName, title, description, hide) {
        let receiver = this.abstractClientWindowMessageSender.getSenderByClientWindow(clientWindow);
        this.sendBackendNoticeMessage(receiver, iconClassName, title, description, hide);
    }

    /**
     * 向 Client 发送应用程序错误消息
     *
     * @param {*} receiver
     * @param {*} backendError 一个 BackendError 对象。
     */
    sendBackendErrorMessage(receiver, backendError) {
        this.send(receiver, 'backendErrorMessage', {
            backendError: backendError
        });
    }

    bindEvents() {
        this.abstractBackendIPC.addEventListener('messageReceived', (args) => {
            let sender = args.sender;
            let messageName = args.name;
            let messageData = args.data;

            this.dispatch(messageName, {
                sender: sender,
                data: messageData
            });
        });
    }
}

module.exports = MessageServer;