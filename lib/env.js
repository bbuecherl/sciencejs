module.exports = (science, _, utils) => {
  science.Conf = (key, value) => {
    if(typeof value === undefined) {
      return _.CONFIG[key];
    } else {
      return (_.CONFIG[key] = value);
    }
  }
};
