class ApiError extends Error {
    constructor (statusCode, message, ...params) {
        super(params)
   
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode
        this.message = message
        Error.captureStackTrace(this)
    }
}

module.exports = ApiError