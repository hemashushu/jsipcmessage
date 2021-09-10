/**
 * 维护 Client Window 与 Sender/Receiver 之间的联系的对象
 */
class AbstractClientWindowMessageSender {

    /**
     * 获取 Client window 对应的 sender/receiver 对象
     *
     * @param {*} clientWindow
     * @returns 如果 Client window 已经关闭或者退出，则返回 null。
     */
    getSenderByClientWindow(clientWindow) {
        //
    }

    /**
     * 通过 sender/receiver 获取 Client window
     *
     * @param {*} sender
     * @returns 如果没有对应的 Client window （比如已经关闭/退出），
     *     则返回 null。
     */
    getClientWindowBySender(sender) {
        //
    }

    /**
     * 通过 Client window 的唯一标识值获取 Client window 对象。
     *
     * @param {*} clientWindowId
     * @returns 如果没有对应的 client window，则返回 null。
     */
    getClientWindowById(clientWindowId) {
        //
    }

    /**
     * 通过 Client window 的唯一标识值获取 sender/receiver 对象。
     *
     * @param {*} clientWindowId
     * @returns 如果没有对应的 id，则返回 null。
     */
    getSenderByClientWindowId(clientWindowId) {
        //
    }
}

module.exports = AbstractClientWindowMessageSender;

