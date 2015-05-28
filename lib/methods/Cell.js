module.exports = (science, _, utils) => {
  // create a new cell from an array or another cell
  science.Cell = (...args) => {
    if(args.length === 1) {
      if(args[0] instanceof CellProto || args[0] instanceof CellPartProto) {
        return args[0].Clone();
      } else {
        args = args[0];
      }
    }

    // get dimensions
    let a = args;
    let dim = [];
    let index = [];
    let data;
    for(;;) {
      dim.push(args.length);
      index.push(1);
      if(Array.isArray(a[0])) {
        a = a[0];
      } else {
        break;
      }
    }

    // create cell
    const c = science.Zeros(dim);

    // populate cell
    for(let i = 0; i < c.__length__; ++i) {
        c.__cells__[c.__indexByArray__(index)] = _.STRUCTURE.AbstractCellProto
            .HELPER.getInArray(args, index, 0);
        // calculate next index
        for(let j = index.length - 1; j >= 0; --j) {
          if(index[j] >= dim[j]) {
            index[j] = 1;
          } else {
            ++index[j];
            break;
          }
        }
    }
    return c;
  }
};
