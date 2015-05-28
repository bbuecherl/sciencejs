module.exports = (science, _, utils) => {
  // create a new cell containing an identity matrix
  science.Eye = (size) => {
    const c = science.Zeros.call(0, size, size);
    for(let i = 1; i < size + 1; ++i) {
      c.Set(i,i, 1);
    }
    return c;
  };
};
