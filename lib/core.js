module.exports = (science, _, utils) => {
  _.INTERNAL.STACK = [];

  _.INTERNAL.Alloc = (...args) => {
    for(let i = 0; i < args.length; ++i) {
      if(_.INTERNAL.STACK.indexOf(args[i]) === -1) {
        _.INTERNAL.STACK.push(args[i]);
      }
    }
  };

  science.Free = (...args) => {
    for(let i = 0; i < args.length; ++i) {
      let index = _.INTERNAL.STACK.indexOf(args[i]);
      if(index > -1) {
        _.INTERNAL.STACK.splice(index, 1);
      }
    }
  };

  science.Info = (arg) => {
    if(arg) {

    } else {
      for(let i = 0; i < _.INTERNAL.STACK.length; ++i) {

      }
    }
  };
};
