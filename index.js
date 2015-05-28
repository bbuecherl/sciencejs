// generate and export global module namespace
var science = module.exports = {};
// generate private namespace
var _ = {
  CONFIG: {},
  INTERNAL: {},
  STRUCTURE: {}
};
// get utilities
var utils = require("./lib/utils");

// require core functions
require("./lib/core")(science, _, utils);

// require structures
require("./lib/structures")(science, _, utils);

// load public methods
require("./lib/methods")(science, _, utils);
