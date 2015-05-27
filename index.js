// generate and export global module namespace
const science = module.exports = {};
// generate private namespace
const _ = {
  CONFIG: {},
  INTERNAL: {}
};
// get utilities
const utils = require("./lib/utils");

// require types
require("./lib/types")(science, _, utils);

// require exceptions
require("./lib/exceptions")(science, _, utils);

// require libraries
require("./lib/core")(science, _, utils);
require("./lib/env")(science, _, utils);
require("./lib/cell")(science, _, utils);
