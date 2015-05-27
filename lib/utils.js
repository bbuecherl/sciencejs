var utils = module.exports = {
  nop: () => undefined,

  filter(arr, filter) {
    let out = [];
    for(let i = 0; i < arr.length; ++i)
      if(filter(arr[i]))
        out.push(arr[i]);
    return out;
  },
  filters: {
    greaterOne(v) {
      return v > 1;
    }
  },

  clear(arr) {
    for(let i = 0; i < arr.length; ++i) {
      arr[i] = 0;
    }
  },

  copy(from, to) {
    for(let i = 0; i < from.length; ++i) {
      to[i] = from[i];
    }
  }
};
