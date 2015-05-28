module.exports = (science, _, utils) => {
  require("./Conf")(science, _, utils);

  require("./Zeros")(science, _, utils);
  require("./Ones")(science, _, utils);
  require("./CellFromData")(science, _, utils);
  require("./Cell")(science, _, utils);
  require("./Eye")(science, _, utils);
  require("./Conf")(science, _, utils);
};
