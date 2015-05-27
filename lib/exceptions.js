module.exports = (science, _, utils) => {
  _.EXCEPTIONS = {
    ArgumentsException: (function() {
      const ArgumentsException = function(argl, type) {
        this.msg = "function requires ";
        switch(type) {
          case ArgumentsException.ATLEAST:
            this.msg += "at least " + argl;
            break;
          case ArgumentsException.EXACTLY:
            this.msg += "exactly " + argl;
            break;
          default: // ArgumentsException.NOTMORE
            this.msg += argl + " or less";
            break;
        }
        this.msg += " arguments";
      };

      ArgumentsException.ATLEAST = 0x00;
      ArgumentsException.EXACTLY = 0x01;
      ArgumentsException.NOTMORE = 0x02;

      return ArgumentsException;
    })(),

    ArgumentsTypeException: (function() {
      const ArgumentsTypeException = function(argi, type) {

      };

      return ArgumentsTypeException;
    })(),

    UnimplementedException: (function() {
      const UnimplementedException = function() {

      };

      return UnimplementedException;
    })(),



    TODOException: (function() {
      const TODOException = function(user, msg) {
        this.name = "TODOException";
        this.message = "TODO(@" + user + ")";
        if(msg) this.message += ": " + msg;
        Error.captureStackTrace(this);
        this.stack = this.stack.split("\n");
        this.stack.splice(1,1);
        this.stack = this.stack.join("\n");
      };
      TODOException.prototype = Error.prototype;

      return TODOException;
    })()
  };
};
