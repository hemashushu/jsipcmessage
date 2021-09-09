class BackendError {
    /**
     *
     * @param {*} code 字符串，错误代号，自定义
     * @param {*} data 错误详细信息的对象
     * @param {*} message 字符串，错误信息
     */
    constructor(code, data, message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}

module.exports = BackendError;