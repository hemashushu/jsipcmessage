const { IllegalArgumentException } = require('jsexception');

/**
 * Client window 列表维护器
 *
 * Client window 是指由主线程创建的窗口线程，窗口线程主要用于显示用户
 * 窗口、渲染前端页面、实现用户交互。
 *
 * 对于 Electron.js 来说，Client window 即 BrowserWindow。
 */
class ClientWindowListMaintainer {
    constructor() {
        // Client window 集合
        //
        // - 对于一个应用程序来说，可能会有多个 Client window，有些 Client window
        //   可能会在程序运行的中途关闭（退出），有些可能会在中途创建，所以这是一个
        //   动态的集合。
        // - 为了提高处理效率，当一个 Client window 关闭后，该集合并不会删除对应的
        //   元素（以免重新整理数组），而是把对应的元素设置为 null。
        // - 有新的 Client window 创建时，优先寻找被设置为 null 的元素，然后把新的
        //   Client window 对象放入该位置。
        this.clientWindows = [];
    }

    /**
     * 获取第一个可用的 Client window
     *
     * @returns 如果没有可用的 Client window，则返回 undefined.
     */
    getFirstAvailableWindow() {
        for (let idx = 0; idx < this.clientWindows.length; idx++) {
            if (this.clientWindows[idx] !== null) {
                return this.clientWindows[idx];
            }
        }
    }

    /**
     * 返回所有有效的 Client window 对象。
     *
     * @returns
     */
    getAllAvailableClientWindows() {
        return this.clientWindows.filter((item) => {
            return item !== null;
        });
    }

    /**
     * 获取第一个被设置为 null 的元素的索引
     *
     * @returns 如果没有值为 null 的元素，则返回 -1，
     *     否则返回第一个值为 null 的元素的索引值。
     */
    getFirstAvailablePlaceholderIndex() {
        let windowIndex = -1;
        for (let idx = 0; idx < this.clientWindows.length; idx++) {
            if (this.clientWindows[idx] === null) {
                windowIndex = idx;
                break;
            }
        }

        return windowIndex;
    }

    /**
     * 添加新的 Client window 对象到列表
     *
     * @param {*} clientWindow
     * @returns 返回新的 Client window 元素在列表中的位置（索引值）
     */
    append(clientWindow) {
        this.clientWindows.push(clientWindow);
        return this.clientWindows.length - 1;
    }

    /**
     * 设置指定索引的元素为 null。
     *
     * 如果指定的索引对应的元素已经是 null，则抛出 IllegalArgumentException 异常。
     *
     * @param {*} placeholderIndex
     */
    release(placeholderIndex) {
        if (this.clientWindows[placeholderIndex] === null) {
            throw new IllegalArgumentException(
                'The element with the specified index value is already null.');
        }

        this.clientWindows[placeholderIndex] = null;
    }

    /**
     * 替换 null 元素为新的 Client window 对象。
     *
     * 如果指定的索引对应的元素不为 null，则抛出 IllegalArgumentException 异常。
     * @param {*} placeholderIndex
     * @param {*} clientWindow
     */
    reuse(placeholderIndex, clientWindow) {
        if (this.clientWindows[placeholderIndex] !== null) {
            throw new IllegalArgumentException(
                'The element with the specified index value is not null.');
        }

        this.clientWindows[placeholderIndex] = clientWindow;
    }
}

module.exports = ClientWindowListMaintainer;
