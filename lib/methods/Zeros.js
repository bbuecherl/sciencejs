module.exports = (science, _, utils) => {
  // create a new cell filled with zeros
  science.Zeros = (...args) => {
    let arg0 = args;
    if(args.length === 1) {
      arg0 = arg0[0];
    }
    return _.STRUCTURE.AbstractCellProto.HELPER.createCell(arg0);
  };
};
