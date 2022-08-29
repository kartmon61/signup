exports.throwError = (condition, message, status) => {
    if (condition) {
      throw [status, message]
    }  
  }
  exports.throw400 = (condition, message) => this.throwError(condition, message, 400)
  exports.throw401 = (condition, message) => this.throwError(condition, message, 401)
  exports.throw403 = (condition, message) => this.throwError(condition, message, 403)
  exports.throw500 = (condition, message) => this.throwError(condition, message, 500)