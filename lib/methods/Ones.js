module.exports = (science, _, utils) => {
  // create a new cell filled with ones
  science.Ones = (...args) => {
    const c = science.Zeros.apply(0, args);
    for(let i = 0; i < c.__length__; ++i) {
      c.__cells__[c.__indexByID__(i)];
    }
    return c;
  };
};
