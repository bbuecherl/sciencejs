module.exports = (science, _, utils) => {
  // create a new cell from a typed array
  science.CellFromData = (data, dimensions) => {
    return AbstractCellProto.HELPER.createCell(data, dimensions);
  };
};
