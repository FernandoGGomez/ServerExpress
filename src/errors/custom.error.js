export default class CustomError extends Error {
    constructor({ name, cause, message, code = 1 }) {
      super(message);
      this.name = name;
      this.code = code;
      this.cause = cause;
    }
  }