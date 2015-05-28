(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.science = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// generate and export global module namespace
"use strict";

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

},{"./lib/core":4,"./lib/methods":13,"./lib/structures":15,"./lib/utils":16}],2:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  science.All = Infinity;
  science.End = -1;
};

},{}],3:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  _.EXCEPTIONS = {
    ArgumentsException: (function () {
      var ArgumentsException = function ArgumentsException(argl, type) {
        this.msg = "function requires ";
        switch (type) {
          case ArgumentsException.ATLEAST:
            this.msg += "at least " + argl;
            break;
          case ArgumentsException.EXACTLY:
            this.msg += "exactly " + argl;
            break;
          default:
            // ArgumentsException.NOTMORE
            this.msg += argl + " or less";
            break;
        }
        this.msg += " arguments";
      };

      ArgumentsException.ATLEAST = 0;
      ArgumentsException.EXACTLY = 1;
      ArgumentsException.NOTMORE = 2;

      return ArgumentsException;
    })(),

    ArgumentsTypeException: (function () {
      var ArgumentsTypeException = function ArgumentsTypeException(argi, type) {};

      return ArgumentsTypeException;
    })(),

    UnimplementedException: (function () {
      var UnimplementedException = function UnimplementedException() {};

      return UnimplementedException;
    })(),

    TODOException: (function () {
      var TODOException = function TODOException(user, msg) {
        this.name = "TODOException";
        this.message = "TODO(@" + user + ")";
        if (msg) this.message += ": " + msg;
        Error.captureStackTrace(this);
        this.stack = this.stack.split("\n");
        this.stack.splice(1, 1);
        this.stack = this.stack.join("\n");
      };
      TODOException.prototype = Error.prototype;

      return TODOException;
    })()
  };
};

},{}],4:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  require("./types")(science, _, utils);
  require("./exceptions")(science, _, utils);
  require("./stack")(science, _, utils);
  require("./constants")(science, _, utils);
};

},{"./constants":2,"./exceptions":3,"./stack":5,"./types":6}],5:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  _.INTERNAL.STACK = [];

  _.INTERNAL.Alloc = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    for (var i = 0; i < args.length; ++i) {
      if (_.INTERNAL.STACK.indexOf(args[i]) === -1) {
        _.INTERNAL.STACK.push(args[i]);
      }
    }
  };

  science.Free = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < args.length; ++i) {
      var index = _.INTERNAL.STACK.indexOf(args[i]);
      if (index > -1) {
        _.INTERNAL.STACK.splice(index, 1);
      }
    }
  };

  science.Info = function (arg) {
    if (arg) {
      return arg.Info();
    } else {
      var str = "Memory information:";
      for (var i = 0; i < _.INTERNAL.STACK.length; ++i) {
        str += "\n" + _.INTERNAL.STACK[i].Info();
      }
      return str;
    }
  };
};

},{}],6:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  _.TYPES = {
    FLOAT: 0,
    INTEGER: 1,
    POSITIVE: 2,
    CELL: 16,
    CELLPART: 17
  };
};

},{}],7:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  // create a new cell from an array or another cell
  science.Cell = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length === 1) {
      if (args[0] instanceof CellProto || args[0] instanceof CellPartProto) {
        return args[0].Clone();
      } else {
        args = args[0];
      }
    }

    // get dimensions
    var a = args;
    var dim = [];
    var index = [];
    var data = undefined;
    for (;;) {
      dim.push(args.length);
      index.push(1);
      if (Array.isArray(a[0])) {
        a = a[0];
      } else {
        break;
      }
    }

    // create cell
    var c = science.Zeros(dim);

    // populate cell
    for (var i = 0; i < c.__length__; ++i) {
      c.__cells__[c.__indexByArray__(index)] = _.STRUCTURE.AbstractCellProto.HELPER.getInArray(args, index, 0);
      // calculate next index
      for (var j = index.length - 1; j >= 0; --j) {
        if (index[j] >= dim[j]) {
          index[j] = 1;
        } else {
          ++index[j];
          break;
        }
      }
    }
    return c;
  };
};

},{}],8:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  // create a new cell from a typed array
  science.CellFromData = function (data, dimensions) {
    return AbstractCellProto.HELPER.createCell(data, dimensions);
  };
};

},{}],9:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  science.Conf = function (key, value) {
    if (typeof value === undefined) {
      return _.CONFIG[key];
    } else {
      return _.CONFIG[key] = value;
    }
  };
};

},{}],10:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  // create a new cell containing an identity matrix
  science.Eye = function (size) {
    var c = science.Zeros.call(0, size, size);
    for (var i = 1; i < size + 1; ++i) {
      c.Set(i, i, 1);
    }
    return c;
  };
};

},{}],11:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  // create a new cell filled with ones
  science.Ones = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var c = science.Zeros.apply(0, args);
    for (var i = 0; i < c.__length__; ++i) {
      c.__cells__[c.__indexByID__(i)];
    }
    return c;
  };
};

},{}],12:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  // create a new cell filled with zeros
  science.Zeros = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var arg0 = args;
    if (args.length === 1) {
      arg0 = arg0[0];
    }
    return _.STRUCTURE.AbstractCellProto.HELPER.createCell(arg0);
  };
};

},{}],13:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  require("./Conf")(science, _, utils);

  require("./Zeros")(science, _, utils);
  require("./Ones")(science, _, utils);
  require("./CellFromData")(science, _, utils);
  require("./Cell")(science, _, utils);
  require("./Eye")(science, _, utils);
  require("./Conf")(science, _, utils);
};

},{"./Cell":7,"./CellFromData":8,"./Conf":9,"./Eye":10,"./Ones":11,"./Zeros":12}],14:[function(require,module,exports){
"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function (science, _, utils) {
  // default datastructure classes
  _.CONFIG.CELL_BASE_CLASS = Float64Array;
  _.CONFIG.CELL_SIZE_CLASS = Uint16Array;

  // internal abstract cell prototype class for cell and cell part classes

  var AbstractCellProto = (function () {
    function AbstractCellProto(name, type, sizes) {
      _classCallCheck(this, AbstractCellProto);

      this.__header__ = AbstractCellProto.HELPER.getHeader(name, sizes);
      this.__type__ = type;
      this.__size__ = new _.CONFIG.CELL_SIZE_CLASS(sizes);
      this.__length__ = AbstractCellProto.HELPER.getSize(sizes);
      this.__dimension__ = sizes.length;
      // setup helpers once to improve performance
      if (!AbstractCellProto.HELPER[this.__dimension__]) {
        AbstractCellProto.HELPER[this.__dimension__] = {
          arrSize1: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__),
          arrSize2: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__),
          arrSize3: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__)
        };
      }
      // quick reference to the helper
      this.__ = AbstractCellProto.HELPER[this.__dimension__];
      _.INTERNAL.Alloc(this);
    }

    _createClass(AbstractCellProto, [{
      key: "__indexByID__",

      // internal functionality
      value: function __indexByID__(id) {
        throw new _.EXCEPTIONS.UnimplementedException();
      }
    }, {
      key: "__indexByArray__",
      value: function __indexByArray__(arr) {
        throw new _.EXCEPTIONS.UnimplementedException();
      }
    }, {
      key: "toString",

      // basic functionality
      // output function
      value: function toString() {
        var str = this.__header__ + " = [";
        for (var i = 0; i < this.__length__; ++i) {
          if (i !== 0) str += ", ";
          str += this.__cells__[this.__indexByID__(i)];
        }
        return str + "]";
      }
    }, {
      key: "Info",
      value: function Info() {
        return this.__header__ + " " + AbstractCellProto.HELPER.getBytes(this.__type__ === _.TYPES.CELL ? this.__cells__.BYTES_PER_ELEMENT * this.__length__ : 0);
      }
    }, {
      key: "Length",

      // length of the cell (counting all entries)
      value: function Length() {
        return this.__length__;
      }
    }, {
      key: "Dimension",

      // dimension of the cell
      value: function Dimension() {
        return this.__dimension__;
      }
    }, {
      key: "Size",

      // dimension-sizes of the cell, returning an array
      value: function Size() {
        return this.__size__;
      }
    }, {
      key: "Clone",

      // clone the cell, returning the new cloned cell
      value: function Clone() {
        if (arg0 instanceof CellPartProto) {
          return arg0.__parent__.Get.apply(arg0.__parent__, arg0.__start__);
        }
        return AbstractCellProto.HELPER.createCell(arg0);
      }
    }, {
      key: "Get",

      // get cell entry/entries, returning the entry or a new cell of entries
      value: function Get() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        // this.__.arrSize1 - indices of the first element
        // this.__.arrSize2 - size of the new cell
        // this.__.arrSize3 - indices of the current element
        var outcell = false;
        var outequal = true;
        for (var i = 0; i < this.__size__.length; ++i) {
          if (i > args.length || args[i] === science.All || args.BYTES_PER_ELEMENT && args[i] === AbstractCellProto.HELPER.MAX_INT.calc(args)) {
            outcell = true;
            this.__.arrSize1[i] = 0;
            this.__.arrSize2[i] = this.__size__[i];
            this.__.arrSize3[i] = 1;
          } else {
            outequal = false;
            if (args[i] < 0) {
              args[i] = this.__size__[i] - args[i] + 1;
            }
            this.__.arrSize1[i] = args[i];
            this.__.arrSize2[i] = 1;
            this.__.arrSize3[i] = args[i];
          }
        }
        if (!outcell) {
          return this.__cells__[this.__indexByArray__(args)];
        } else if (outequal) {
          return this.Clone();
        } else {
          var cell = AbstractCellProto.HELPER.createCell(utils.filter(this.__.arrSize2, utils.filters.greaterOne));

          for (var i = 0; i < cell.__length__; ++i) {
            cell.__cells__[cell.__indexByID__(i)] = this.__cells__[this.__indexByArray__(this.__.arrSize3)];
            // calculate next index
            for (var j = this.__.arrSize3.length - 1; j >= 0; --j) {
              if (this.__.arrSize1[j] === 0) {
                if (this.__.arrSize3[j] >= this.__.arrSize2[j]) {
                  this.__.arrSize3[j] = 1;
                } else {
                  ++this.__.arrSize3[j];
                  break;
                }
              }
            }
          }
          return cell;
        }
      }
    }, {
      key: "Set",

      // set cell entry/entries
      value: function Set() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        // this.__.arrSize1 - indices of the first element
        // this.__.arrSize2 - size of the setter cell
        // this.__.arrSize3 - indices of the current element
        var value = args[args.length - 1];
        var incell = false;
        var inequal = true;
        for (var i = 0; i < this.__size__.length; ++i) {
          if (i > args.length - 1 || args[i] === science.All || args.BYTES_PER_ELEMENT && args[i] === AbstractCellProto.HELPER.MAX_INT.calc(args)) {
            incell = true;
            this.__.arrSize1[i] = 0;
            this.__.arrSize2[i] = this.__size__[i];
            this.__.arrSize3[i] = 1;
          } else {
            inequal = false;
            if (args[i] < 0) {
              args[i] = this.__size__[i] - args[i] + 1;
            }
            this.__.arrSize1[i] = args[i];
            this.__.arrSize2[i] = 1;
            this.__.arrSize3[i] = args[i];
          }
        }
        if (!incell) {
          this.__cells__[this.__indexByArray__(args)] = value;
        } else {
          if (!(value instanceof CellProto)) {
            throw new ArgumentsTypeException(args.length, _.TYPES.CELL);
          }
          if (inequal) {
            for (var i = 0; i < this.__length__; ++i) {
              this.__cells__[this.__indexByID__(i)] = value.__cells__[this.__indexByID__(i)];
            }
          } else {
            for (var i = 0; i < value.__length__; ++i) {
              this.__cells__[this.__indexByArray__(this.__.arrSize3)] = value.__cells__[value.__indexByID__(i)];
              // calculate next index
              for (var j = this.__.arrSize3.length - 1; j >= 0; --j) {
                if (this.__.arrSize1[j] === 0) {
                  if (this.__.arrSize3[j] >= this.__.arrSize2[j]) {
                    this.__.arrSize3[j] = 1;
                  } else {
                    ++this.__.arrSize3[j];
                    break;
                  }
                }
              }
            }
          }
        }
        return this;
      }
    }, {
      key: "Part",

      // get cell entry/entries, returning the entry or a cellpart of the cell
      value: function Part() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        // TODO(@bbuecherl) add caching?
        // this.__.arrSize1 - indices of the first element
        // this.__.arrSize2 - size of the new cellpart
        var outcell = false;
        var outequal = true;
        for (var i = 0; i < this.__size__.length; ++i) {
          if (i > args.length || args[i] === science.All || args.BYTES_PER_ELEMENT && args[i] === AbstractCellProto.HELPER.MAX_INT.calc(args)) {
            outcell = true;
            this.__.arrSize1[i] = 0;
            this.__.arrSize2[i] = this.__size__[i];
          } else {
            outequal = false;
            if (args[i] < 0) {
              args[i] = this.__size__[i] - args[i] + 1;
            }
            this.__.arrSize1[i] = args[i];
            this.__.arrSize2[i] = 1;
          }
        }
        if (!outcell) {
          return this.__cells__[this.__indexByArray__(args)];
        } else if (outequal) {
          return this instanceof CellPartProto ? this : AbstractCellProto.HELPER.createCellPart(this, this.__size__, 0, 0);
        } else {
          if (this instanceof CellPartProto) {
            return this.__parent__.Part(AbstractCellProto.HELPER.joinParts(this.__start__, this.__.arrSize1));
          } else {
            return AbstractCellProto.HELPER.createCellPart(this, utils.filter(this.__.arrSize2, utils.filters.greaterOne), new _.CONFIG.CELL_SIZE_CLASS(this.__.arrSize1), new _.CONFIG.CELL_SIZE_CLASS(this.__.arrSize2));
          }
        }
      }
    }, {
      key: "Row",

      // the callback is executed on each row of the cell
      value: function Row(callback) {
        for (var i = 1; i <= this.__size__[0]; ++i) {
          callback(this.Part(i), i, this);
        }
        return this;
      }
    }, {
      key: "Every",

      // the callback is executed on each entry of the cell
      value: function Every(callback) {
        for (var i = 0; i < this.__length__; ++i) {
          callback.call(this, this.__cells__[this.__indexByID__(i)], i, this);
        }
      }
    }, {
      key: "Each",

      // the callback is executed on each entry of the cell, with coordinates
      value: function Each(callback) {
        for (var i = 0; i < this.__size__.length; ++i) {
          this.__.arrSize1[i] = 1;
        }
        for (var i = 0; i < this.__length__; ++i) {
          // TODO(@bbuecherl) change call parameters (no array!)
          callback.call(this, this.__cells__[this.__indexByArray__(this.__.arrSize1)], this.__.arrSize1, this);
          // calculate next index
          for (var j = this.__size__.length - 1; j >= 0; --j) {
            if (this.__.arrSize1[j] >= this.__size__[j]) {
              this.__.arrSize1[j] = 1;
            } else {
              ++this.__.arrSize1[j];
              break;
            }
          }
        }
      }
    }, {
      key: "Sort",

      // sort and search functions
      // sort the cell
      value: function Sort(order, compareCallback) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Filter",

      // filter the cell, returning a new cell of entries
      value: function Filter(filterCallback) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Unique",

      // remove dublicates and sort, returning a new cell
      value: function Unique(order) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Find",

      // find entry or entries, returning the entry or a new cell of entries
      value: function Find(findCallback) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Add",

      // basic arithmetics
      // add a cell or number to this cell
      value: function Add(o) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Sub",

      // substract a cell or number from this cell
      value: function Sub(o) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Mul",

      // multiply a cell or number with this cell
      value: function Mul(o) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Div",

      // divide a cell or number from this cell
      value: function Div(o) {
        throw new _.EXCEPTIONS.TODOException("bbuecherl");
      }
    }, {
      key: "Abs",

      // utilities
      // calculate absolute value of each entry of this cell
      value: function Abs() {
        for (var i = 0; i < this.__length__; ++i) {
          var index = this.__indexByID__(i);
          this.__cells__[index] = Math.abs(this.__cells__[index]);
        }
        return this;
      }
    }, {
      key: "Sum",

      // calculate the sum of all entries of this cell
      value: function Sum() {
        var sum = 0;
        for (var i = 0; i < this.__length__; ++i) {
          sum += this.__cells__[this.__indexByID__(i)];
        }
        return sum;
      }
    }, {
      key: "Prod",

      // calculate the product of all entries of this cell
      value: function Prod() {
        var prod = 1;
        for (var i = 0; i < this.__length__; ++i) {
          prod *= this.__cells__[this.__indexByID__(i)];
        }
        return prod;
      }
    }]);

    return AbstractCellProto;
  })();

  ;

  // namespace for abstract cell internal helpers
  AbstractCellProto.HELPER = {
    // cache MAX_INT for typed arrays
    MAX_INT: {
      calc: function calc(a) {
        var bpe = a.BYTES_PER_ELEMENT;
        if (!AbstractCellProto.HELPER.MAX_INT[bpe]) {
          return AbstractCellProto.HELPER.MAX_INT[bpe] = Math.pow(2, bpe * 8) - 1;
        }
        return AbstractCellProto.HELPER.MAX_INT[bpe];
      }
    },

    // internal constructor for cells
    createCell: function createCell(arg0, dim) {
      var c = function Cell() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return c.Get.apply(c, args);
      };
      c.__proto__ = new CellProto(arg0, dim);
      return c;
    },

    // internal constructor for cell parts
    createCellPart: function createCellPart(parent, sizes, start, end) {
      var c = function CellPart() {
        for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return c.Get.apply(c, args);
      };
      c.__proto__ = new CellPartProto(parent, sizes, start, end);
      return c;
    },

    // get size of the internal data structure of given dimension-sizes
    getSize: function getSize(sizes) {
      var index = sizes[0] - 1;
      for (var i = 1; i < sizes.length; ++i) {
        index = index * sizes[i - 1] + sizes[i] - 1;
      }
      return index + 1;
    },

    // get index
    getIndex: function getIndex(args, sizes) {
      var index = args[0] - 1;
      for (var i = 1; i < sizes.length; ++i) {
        index = index * sizes[i - 1] + args[i] - 1;
      }
      return index;
    },

    // join index offsets of cell parts
    joinParts: function joinParts(start, next, out) {
      out = out || new _.CONFIG.CELL_SIZE_CLASS(next);
      var ni = 0;
      for (var i = 0; i < start.length; ++i) {
        if (start[i] == 0) {
          if (next[i] == 0) {
            out[i] = AbstractCellProto.HELPER.MAX_INT.calc(out);
          } else {
            out[i] = next[ni++];
          }
        } else {
          out[i] = start[i];
        }
      }
      return out;
    },

    // prepare header for .toString()
    getHeader: function getHeader(name, sizes) {
      var out = name + "(";
      for (var i = 0; i < sizes.length; ++i) {
        if (i != 0) out += "x";
        out += sizes[i];
      }
      return out + ")";
    },

    isTypedArray: function isTypedArray(a) {
      /*
      return a instanceof Int8Array || a instanceof Uint8Array || a instanceof
          Uint8ClampedArray || a instanceof Int16Array || a instanceof
          Uint16Array || a instanceof Int32Array || a instanceof Uint32Array ||
          a instanceof Float32Array || a instanceof Float64Array;
      */
      return a.buffer && a.BYTES_PER_ELEMENT;
    },

    BYTES: ["Bytes", "KBytes", "MBytes", "GBytes", "TBytes", "PBytes"],

    getBytes: function getBytes(b, s) {
      if (b / 1000 > 1) {
        return AbstractCellProto.HELPER.getBytes(b / 1000, !!s ? s + 1 : 1);
      }
      return b + " " + AbstractCellProto.HELPER.BYTES[!!s ? s : 0];
    },

    getInArray: function getInArray(arr, indices, def) {
      var i = 0;
      while (i < indices.length && (arr = arr[indices[i++] - 1]));
      console.log(indices, arr || def);
      return arr || def;
    }
  };

  // internal prototype class for cell parts

  var CellPartProto = (function (_AbstractCellProto) {
    function CellPartProto(parent, sizes, start, end) {
      _classCallCheck(this, CellPartProto);

      _get(Object.getPrototypeOf(CellPartProto.prototype), "constructor", this).call(this, "CellPart", _.TYPES.CELLPART, sizes);
      this.__parent__ = parent;
      this.__start__ = start;
      this.__end__ = end;
      this.__cells__ = parent.__cells__;
    }

    _inherits(CellPartProto, _AbstractCellProto);

    _createClass(CellPartProto, [{
      key: "__indexByID__",

      // internal functionality
      value: function __indexByID__(id) {
        for (var i = 0; i < this.__start__.length; ++i) {
          this.__parent__.__.arrSize1[i] = this.__start__[i] === 0 ? 1 : this.__start__[i];
        }
        for (var i = 0; i < id; ++i) {
          // calculate next index
          for (var j = this.__start__.length - 1; j >= 0; --j) {
            if (this.__start__[j] === 0) {
              if (this.__parent__.__.arrSize1[j] >= this.__parent__.__size__[j]) {
                this.__parent__.__.arrSize1[j] = 1;
              } else {
                ++this.__parent__.__.arrSize1[j];
                break;
              }
            }
          }
        }
        return this.__parent__.__indexByArray__(this.__parent__.__.arrSize1);
      }
    }, {
      key: "__indexByArray__",
      value: function __indexByArray__(arr) {
        return AbstractCellProto.HELPER.getIndex(AbstractCellProto.HELPER.joinParts(this.__start__, arr, this.__parent__.__.arrSize1), this.__parent__.__size__);
      }
    }]);

    return CellPartProto;
  })(AbstractCellProto);

  ;

  // internal prototype class for cells

  var CellProto = (function (_AbstractCellProto2) {
    // constructor

    function CellProto(arg0, dim) {
      _classCallCheck(this, CellProto);

      if (AbstractCellProto.HELPER.isTypedArray(arg0) && AbstractCellProto.HELPER.getSize(dim) === arg0.length) {
        _get(Object.getPrototypeOf(CellProto.prototype), "constructor", this).call(this, "Cell", _.TYPES.CELL, dim);
        this.__cells__ = arg0;
      } else if (arg0 instanceof CellProto) {
        _get(Object.getPrototypeOf(CellProto.prototype), "constructor", this).call(this, "Cell", _.TYPES.CELL, arg0.__size__);
        this.__cells__ = new _.CONFIG.CELL_BASE_CLASS(arg0.__cells__);
      } else {
        _get(Object.getPrototypeOf(CellProto.prototype), "constructor", this).call(this, "Cell", _.TYPES.CELL, arg0);
        this.__cells__ = new _.CONFIG.CELL_BASE_CLASS(this.__length__);
      }
    }

    _inherits(CellProto, _AbstractCellProto2);

    _createClass(CellProto, [{
      key: "__indexByID__",

      // internal functionality
      value: function __indexByID__(id) {
        return id;
      }
    }, {
      key: "__indexByArray__",
      value: function __indexByArray__(arr) {
        return AbstractCellProto.HELPER.getIndex(arr, this.__size__);
      }
    }]);

    return CellProto;
  })(AbstractCellProto);

  ;

  _.STRUCTURE.AbstractCellProto = AbstractCellProto;
  _.STRUCTURE.CellPartProto = CellPartProto;
  _.STRUCTURE.CellProto = CellProto;
};

},{}],15:[function(require,module,exports){
"use strict";

module.exports = function (science, _, utils) {
  require("./cell")(science, _, utils);
};

},{"./cell":14}],16:[function(require,module,exports){
"use strict";

var utils = module.exports = {
  nop: function nop() {
    return undefined;
  },

  filter: function filter(arr, _filter) {
    var out = [];
    for (var i = 0; i < arr.length; ++i) {
      if (_filter(arr[i])) out.push(arr[i]);
    }return out;
  },
  filters: {
    greaterOne: function greaterOne(v) {
      return v > 1;
    }
  },

  clear: function clear(arr) {
    for (var i = 0; i < arr.length; ++i) {
      arr[i] = 0;
    }
  },

  copy: function copy(from, to) {
    for (var i = 0; i < from.length; ++i) {
      to[i] = from[i];
    }
  }
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYmJ1ZWNoZXJsL29jL3NjaWVuY2Vqcy9pbmRleC5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9jb3JlL2NvbnN0YW50cy5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9jb3JlL2V4Y2VwdGlvbnMuanMiLCIvVXNlcnMvYmJ1ZWNoZXJsL29jL3NjaWVuY2Vqcy9saWIvY29yZS9pbmRleC5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9jb3JlL3N0YWNrLmpzIiwiL1VzZXJzL2JidWVjaGVybC9vYy9zY2llbmNlanMvbGliL2NvcmUvdHlwZXMuanMiLCIvVXNlcnMvYmJ1ZWNoZXJsL29jL3NjaWVuY2Vqcy9saWIvbWV0aG9kcy9DZWxsLmpzIiwiL1VzZXJzL2JidWVjaGVybC9vYy9zY2llbmNlanMvbGliL21ldGhvZHMvQ2VsbEZyb21EYXRhLmpzIiwiL1VzZXJzL2JidWVjaGVybC9vYy9zY2llbmNlanMvbGliL21ldGhvZHMvQ29uZi5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9tZXRob2RzL0V5ZS5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9tZXRob2RzL09uZXMuanMiLCIvVXNlcnMvYmJ1ZWNoZXJsL29jL3NjaWVuY2Vqcy9saWIvbWV0aG9kcy9aZXJvcy5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9tZXRob2RzL2luZGV4LmpzIiwiL1VzZXJzL2JidWVjaGVybC9vYy9zY2llbmNlanMvbGliL3N0cnVjdHVyZXMvY2VsbC5qcyIsIi9Vc2Vycy9iYnVlY2hlcmwvb2Mvc2NpZW5jZWpzL2xpYi9zdHJ1Y3R1cmVzL2luZGV4LmpzIiwiL1VzZXJzL2JidWVjaGVybC9vYy9zY2llbmNl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QUU7QUFDbEIsUUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2IsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDO0FBQ2hDLFVBQUcsT0FBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNmLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FBQSxBQUNyQixPQUFPLEdBQUcsQ0FBQztHQUNaO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsY0FBVSxFQUFBLG9CQUFDLENBQUMsRUFBRTtBQUNaLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkO0dBQ0Y7O0FBRUQsT0FBSyxFQUFBLGVBQUMsR0FBRyxFQUFFO0FBQ1QsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDbEMsU0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNaO0dBQ0Y7O0FBRUQsTUFBSSxFQUFBLGNBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUNiLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQ25DLFFBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakI7R0FDRjtDQUNGLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gZ2VuZXJhdGUgYW5kIGV4cG9ydCBnbG9iYWwgbW9kdWxlIG5hbWVzcGFjZVxudmFyIHNjaWVuY2UgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuLy8gZ2VuZXJhdGUgcHJpdmF0ZSBuYW1lc3BhY2VcbnZhciBfID0ge1xuICBDT05GSUc6IHt9LFxuICBJTlRFUk5BTDoge30sXG4gIFNUUlVDVFVSRToge31cbn07XG4vLyBnZXQgdXRpbGl0aWVzXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi9saWIvdXRpbHNcIik7XG5cbi8vIHJlcXVpcmUgY29yZSBmdW5jdGlvbnNcbnJlcXVpcmUoXCIuL2xpYi9jb3JlXCIpKHNjaWVuY2UsIF8sIHV0aWxzKTtcblxuLy8gcmVxdWlyZSBzdHJ1Y3R1cmVzXG5yZXF1aXJlKFwiLi9saWIvc3RydWN0dXJlc1wiKShzY2llbmNlLCBfLCB1dGlscyk7XG5cbi8vIGxvYWQgcHVibGljIG1ldGhvZHNcbnJlcXVpcmUoXCIuL2xpYi9tZXRob2RzXCIpKHNjaWVuY2UsIF8sIHV0aWxzKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHNjaWVuY2UsIF8sIHV0aWxzKSA9PiB7XG4gIHNjaWVuY2UuQWxsID0gSW5maW5pdHk7XG4gIHNjaWVuY2UuRW5kID0gLTE7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgXy5FWENFUFRJT05TID0ge1xuICAgIEFyZ3VtZW50c0V4Y2VwdGlvbjogKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgQXJndW1lbnRzRXhjZXB0aW9uID0gZnVuY3Rpb24oYXJnbCwgdHlwZSkge1xuICAgICAgICB0aGlzLm1zZyA9IFwiZnVuY3Rpb24gcmVxdWlyZXMgXCI7XG4gICAgICAgIHN3aXRjaCh0eXBlKSB7XG4gICAgICAgICAgY2FzZSBBcmd1bWVudHNFeGNlcHRpb24uQVRMRUFTVDpcbiAgICAgICAgICAgIHRoaXMubXNnICs9IFwiYXQgbGVhc3QgXCIgKyBhcmdsO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBBcmd1bWVudHNFeGNlcHRpb24uRVhBQ1RMWTpcbiAgICAgICAgICAgIHRoaXMubXNnICs9IFwiZXhhY3RseSBcIiArIGFyZ2w7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OiAvLyBBcmd1bWVudHNFeGNlcHRpb24uTk9UTU9SRVxuICAgICAgICAgICAgdGhpcy5tc2cgKz0gYXJnbCArIFwiIG9yIGxlc3NcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubXNnICs9IFwiIGFyZ3VtZW50c1wiO1xuICAgICAgfTtcblxuICAgICAgQXJndW1lbnRzRXhjZXB0aW9uLkFUTEVBU1QgPSAweDAwO1xuICAgICAgQXJndW1lbnRzRXhjZXB0aW9uLkVYQUNUTFkgPSAweDAxO1xuICAgICAgQXJndW1lbnRzRXhjZXB0aW9uLk5PVE1PUkUgPSAweDAyO1xuXG4gICAgICByZXR1cm4gQXJndW1lbnRzRXhjZXB0aW9uO1xuICAgIH0pKCksXG5cbiAgICBBcmd1bWVudHNUeXBlRXhjZXB0aW9uOiAoZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBBcmd1bWVudHNUeXBlRXhjZXB0aW9uID0gZnVuY3Rpb24oYXJnaSwgdHlwZSkge1xuXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gQXJndW1lbnRzVHlwZUV4Y2VwdGlvbjtcbiAgICB9KSgpLFxuXG4gICAgVW5pbXBsZW1lbnRlZEV4Y2VwdGlvbjogKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgVW5pbXBsZW1lbnRlZEV4Y2VwdGlvbiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gVW5pbXBsZW1lbnRlZEV4Y2VwdGlvbjtcbiAgICB9KSgpLFxuXG5cblxuICAgIFRPRE9FeGNlcHRpb246IChmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IFRPRE9FeGNlcHRpb24gPSBmdW5jdGlvbih1c2VyLCBtc2cpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gXCJUT0RPRXhjZXB0aW9uXCI7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IFwiVE9ETyhAXCIgKyB1c2VyICsgXCIpXCI7XG4gICAgICAgIGlmKG1zZykgdGhpcy5tZXNzYWdlICs9IFwiOiBcIiArIG1zZztcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcyk7XG4gICAgICAgIHRoaXMuc3RhY2sgPSB0aGlzLnN0YWNrLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB0aGlzLnN0YWNrLnNwbGljZSgxLDEpO1xuICAgICAgICB0aGlzLnN0YWNrID0gdGhpcy5zdGFjay5qb2luKFwiXFxuXCIpO1xuICAgICAgfTtcbiAgICAgIFRPRE9FeGNlcHRpb24ucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG4gICAgICByZXR1cm4gVE9ET0V4Y2VwdGlvbjtcbiAgICB9KSgpXG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgcmVxdWlyZShcIi4vdHlwZXNcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xuICByZXF1aXJlKFwiLi9leGNlcHRpb25zXCIpKHNjaWVuY2UsIF8sIHV0aWxzKTtcbiAgcmVxdWlyZShcIi4vc3RhY2tcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xuICByZXF1aXJlKFwiLi9jb25zdGFudHNcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHNjaWVuY2UsIF8sIHV0aWxzKSA9PiB7XG4gIF8uSU5URVJOQUwuU1RBQ0sgPSBbXTtcblxuICBfLklOVEVSTkFMLkFsbG9jID0gKC4uLmFyZ3MpID0+IHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xuICAgICAgaWYoXy5JTlRFUk5BTC5TVEFDSy5pbmRleE9mKGFyZ3NbaV0pID09PSAtMSkge1xuICAgICAgICBfLklOVEVSTkFMLlNUQUNLLnB1c2goYXJnc1tpXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHNjaWVuY2UuRnJlZSA9ICguLi5hcmdzKSA9PiB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxldCBpbmRleCA9IF8uSU5URVJOQUwuU1RBQ0suaW5kZXhPZihhcmdzW2ldKTtcbiAgICAgIGlmKGluZGV4ID4gLTEpIHtcbiAgICAgICAgXy5JTlRFUk5BTC5TVEFDSy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBzY2llbmNlLkluZm8gPSAoYXJnKSA9PiB7XG4gICAgaWYoYXJnKSB7XG4gICAgICByZXR1cm4gYXJnLkluZm8oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHN0ciA9IFwiTWVtb3J5IGluZm9ybWF0aW9uOlwiO1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IF8uSU5URVJOQUwuU1RBQ0subGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3RyICs9IFwiXFxuXCIgKyBfLklOVEVSTkFMLlNUQUNLW2ldLkluZm8oKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHNjaWVuY2UsIF8sIHV0aWxzKSA9PiB7XG4gIF8uVFlQRVMgPSB7XG4gICAgRkxPQVQ6IDB4MDAsXG4gICAgSU5URUdFUjogMHgwMSxcbiAgICBQT1NJVElWRTogMHgwMixcbiAgICBDRUxMOiAweDEwLFxuICAgIENFTExQQVJUOiAweDAxMVxuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHNjaWVuY2UsIF8sIHV0aWxzKSA9PiB7XG4gIC8vIGNyZWF0ZSBhIG5ldyBjZWxsIGZyb20gYW4gYXJyYXkgb3IgYW5vdGhlciBjZWxsXG4gIHNjaWVuY2UuQ2VsbCA9ICguLi5hcmdzKSA9PiB7XG4gICAgaWYoYXJncy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmKGFyZ3NbMF0gaW5zdGFuY2VvZiBDZWxsUHJvdG8gfHwgYXJnc1swXSBpbnN0YW5jZW9mIENlbGxQYXJ0UHJvdG8pIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbMF0uQ2xvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFyZ3MgPSBhcmdzWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGdldCBkaW1lbnNpb25zXG4gICAgbGV0IGEgPSBhcmdzO1xuICAgIGxldCBkaW0gPSBbXTtcbiAgICBsZXQgaW5kZXggPSBbXTtcbiAgICBsZXQgZGF0YTtcbiAgICBmb3IoOzspIHtcbiAgICAgIGRpbS5wdXNoKGFyZ3MubGVuZ3RoKTtcbiAgICAgIGluZGV4LnB1c2goMSk7XG4gICAgICBpZihBcnJheS5pc0FycmF5KGFbMF0pKSB7XG4gICAgICAgIGEgPSBhWzBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGNlbGxcbiAgICBjb25zdCBjID0gc2NpZW5jZS5aZXJvcyhkaW0pO1xuXG4gICAgLy8gcG9wdWxhdGUgY2VsbFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgICBjLl9fY2VsbHNfX1tjLl9faW5kZXhCeUFycmF5X18oaW5kZXgpXSA9IF8uU1RSVUNUVVJFLkFic3RyYWN0Q2VsbFByb3RvXG4gICAgICAgICAgICAuSEVMUEVSLmdldEluQXJyYXkoYXJncywgaW5kZXgsIDApO1xuICAgICAgICAvLyBjYWxjdWxhdGUgbmV4dCBpbmRleFxuICAgICAgICBmb3IobGV0IGogPSBpbmRleC5sZW5ndGggLSAxOyBqID49IDA7IC0taikge1xuICAgICAgICAgIGlmKGluZGV4W2pdID49IGRpbVtqXSkge1xuICAgICAgICAgICAgaW5kZXhbal0gPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICArK2luZGV4W2pdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgLy8gY3JlYXRlIGEgbmV3IGNlbGwgZnJvbSBhIHR5cGVkIGFycmF5XG4gIHNjaWVuY2UuQ2VsbEZyb21EYXRhID0gKGRhdGEsIGRpbWVuc2lvbnMpID0+IHtcbiAgICByZXR1cm4gQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLmNyZWF0ZUNlbGwoZGF0YSwgZGltZW5zaW9ucyk7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgc2NpZW5jZS5Db25mID0gKGtleSwgdmFsdWUpID0+IHtcbiAgICBpZih0eXBlb2YgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIF8uQ09ORklHW2tleV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXy5DT05GSUdba2V5XSA9IHZhbHVlKTtcbiAgICB9XG4gIH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzY2llbmNlLCBfLCB1dGlscykgPT4ge1xuICAvLyBjcmVhdGUgYSBuZXcgY2VsbCBjb250YWluaW5nIGFuIGlkZW50aXR5IG1hdHJpeFxuICBzY2llbmNlLkV5ZSA9IChzaXplKSA9PiB7XG4gICAgY29uc3QgYyA9IHNjaWVuY2UuWmVyb3MuY2FsbCgwLCBzaXplLCBzaXplKTtcbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc2l6ZSArIDE7ICsraSkge1xuICAgICAgYy5TZXQoaSxpLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgLy8gY3JlYXRlIGEgbmV3IGNlbGwgZmlsbGVkIHdpdGggb25lc1xuICBzY2llbmNlLk9uZXMgPSAoLi4uYXJncykgPT4ge1xuICAgIGNvbnN0IGMgPSBzY2llbmNlLlplcm9zLmFwcGx5KDAsIGFyZ3MpO1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBjLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgYy5fX2NlbGxzX19bYy5fX2luZGV4QnlJRF9fKGkpXTtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgLy8gY3JlYXRlIGEgbmV3IGNlbGwgZmlsbGVkIHdpdGggemVyb3NcbiAgc2NpZW5jZS5aZXJvcyA9ICguLi5hcmdzKSA9PiB7XG4gICAgbGV0IGFyZzAgPSBhcmdzO1xuICAgIGlmKGFyZ3MubGVuZ3RoID09PSAxKSB7XG4gICAgICBhcmcwID0gYXJnMFswXTtcbiAgICB9XG4gICAgcmV0dXJuIF8uU1RSVUNUVVJFLkFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5jcmVhdGVDZWxsKGFyZzApO1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gKHNjaWVuY2UsIF8sIHV0aWxzKSA9PiB7XG4gIHJlcXVpcmUoXCIuL0NvbmZcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xuXG4gIHJlcXVpcmUoXCIuL1plcm9zXCIpKHNjaWVuY2UsIF8sIHV0aWxzKTtcbiAgcmVxdWlyZShcIi4vT25lc1wiKShzY2llbmNlLCBfLCB1dGlscyk7XG4gIHJlcXVpcmUoXCIuL0NlbGxGcm9tRGF0YVwiKShzY2llbmNlLCBfLCB1dGlscyk7XG4gIHJlcXVpcmUoXCIuL0NlbGxcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xuICByZXF1aXJlKFwiLi9FeWVcIikoc2NpZW5jZSwgXywgdXRpbHMpO1xuICByZXF1aXJlKFwiLi9Db25mXCIpKHNjaWVuY2UsIF8sIHV0aWxzKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChzY2llbmNlLCBfLCB1dGlscykgPT4ge1xuICAvLyBkZWZhdWx0IGRhdGFzdHJ1Y3R1cmUgY2xhc3Nlc1xuICBfLkNPTkZJRy5DRUxMX0JBU0VfQ0xBU1MgPSBGbG9hdDY0QXJyYXk7XG4gIF8uQ09ORklHLkNFTExfU0laRV9DTEFTUyA9IFVpbnQxNkFycmF5O1xuXG4gIC8vIGludGVybmFsIGFic3RyYWN0IGNlbGwgcHJvdG90eXBlIGNsYXNzIGZvciBjZWxsIGFuZCBjZWxsIHBhcnQgY2xhc3Nlc1xuICBjbGFzcyBBYnN0cmFjdENlbGxQcm90byB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgdHlwZSwgc2l6ZXMpIHtcbiAgICAgIHRoaXMuX19oZWFkZXJfXyA9IEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5nZXRIZWFkZXIobmFtZSwgc2l6ZXMpO1xuICAgICAgdGhpcy5fX3R5cGVfXyA9IHR5cGU7XG4gICAgICB0aGlzLl9fc2l6ZV9fID0gbmV3IF8uQ09ORklHLkNFTExfU0laRV9DTEFTUyhzaXplcyk7XG4gICAgICB0aGlzLl9fbGVuZ3RoX18gPSBBYnN0cmFjdENlbGxQcm90by5IRUxQRVIuZ2V0U2l6ZShzaXplcyk7XG4gICAgICB0aGlzLl9fZGltZW5zaW9uX18gPSBzaXplcy5sZW5ndGg7XG4gICAgICAvLyBzZXR1cCBoZWxwZXJzIG9uY2UgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgICAgaWYoIUFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUlt0aGlzLl9fZGltZW5zaW9uX19dKSB7XG4gICAgICAgIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUlt0aGlzLl9fZGltZW5zaW9uX19dID0ge1xuICAgICAgICAgIGFyclNpemUxOiBuZXcgXy5DT05GSUcuQ0VMTF9TSVpFX0NMQVNTKHRoaXMuX19kaW1lbnNpb25fXyksXG4gICAgICAgICAgYXJyU2l6ZTI6IG5ldyBfLkNPTkZJRy5DRUxMX1NJWkVfQ0xBU1ModGhpcy5fX2RpbWVuc2lvbl9fKSxcbiAgICAgICAgICBhcnJTaXplMzogbmV3IF8uQ09ORklHLkNFTExfU0laRV9DTEFTUyh0aGlzLl9fZGltZW5zaW9uX18pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIHF1aWNrIHJlZmVyZW5jZSB0byB0aGUgaGVscGVyXG4gICAgICB0aGlzLl9fID0gQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSW3RoaXMuX19kaW1lbnNpb25fX107XG4gICAgICBfLklOVEVSTkFMLkFsbG9jKHRoaXMpO1xuICAgIH1cblxuICAgIC8vIGludGVybmFsIGZ1bmN0aW9uYWxpdHlcbiAgICBfX2luZGV4QnlJRF9fKGlkKSB7XG4gICAgICB0aHJvdyBuZXcgXy5FWENFUFRJT05TLlVuaW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcbiAgICB9XG4gICAgX19pbmRleEJ5QXJyYXlfXyhhcnIpIHtcbiAgICAgIHRocm93IG5ldyBfLkVYQ0VQVElPTlMuVW5pbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xuICAgIH1cblxuICAgIC8vIGJhc2ljIGZ1bmN0aW9uYWxpdHlcbiAgICAvLyBvdXRwdXQgZnVuY3Rpb25cbiAgICB0b1N0cmluZygpIHtcbiAgICAgIGxldCBzdHIgPSB0aGlzLl9faGVhZGVyX18gKyBcIiA9IFtcIjtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgICBpZihpICE9PSAwKSBzdHIgKz0gXCIsIFwiO1xuICAgICAgICBzdHIgKz0gdGhpcy5fX2NlbGxzX19bdGhpcy5fX2luZGV4QnlJRF9fKGkpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdHIgKyBcIl1cIjtcbiAgICB9XG4gICAgSW5mbygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faGVhZGVyX18gKyBcIiBcIiArXG4gICAgICAgICAgQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLmdldEJ5dGVzKHRoaXMuX190eXBlX18gPT09IF8uVFlQRVMuQ0VMTCA/XG4gICAgICAgICAgICB0aGlzLl9fY2VsbHNfXy5CWVRFU19QRVJfRUxFTUVOVCAqIHRoaXMuX19sZW5ndGhfXyA6IDApO1xuICAgIH1cbiAgICAvLyBsZW5ndGggb2YgdGhlIGNlbGwgKGNvdW50aW5nIGFsbCBlbnRyaWVzKVxuICAgIExlbmd0aCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fbGVuZ3RoX187XG4gICAgfVxuICAgIC8vIGRpbWVuc2lvbiBvZiB0aGUgY2VsbFxuICAgIERpbWVuc2lvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fZGltZW5zaW9uX187XG4gICAgfVxuICAgIC8vIGRpbWVuc2lvbi1zaXplcyBvZiB0aGUgY2VsbCwgcmV0dXJuaW5nIGFuIGFycmF5XG4gICAgU2l6ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc2l6ZV9fO1xuICAgIH1cbiAgICAvLyBjbG9uZSB0aGUgY2VsbCwgcmV0dXJuaW5nIHRoZSBuZXcgY2xvbmVkIGNlbGxcbiAgICBDbG9uZSgpIHtcbiAgICAgIGlmKGFyZzAgaW5zdGFuY2VvZiBDZWxsUGFydFByb3RvKSB7XG4gICAgICAgIHJldHVybiBhcmcwLl9fcGFyZW50X18uR2V0LmFwcGx5KGFyZzAuX19wYXJlbnRfXywgYXJnMC5fX3N0YXJ0X18pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5jcmVhdGVDZWxsKGFyZzApO1xuICAgIH1cbiAgICAvLyBnZXQgY2VsbCBlbnRyeS9lbnRyaWVzLCByZXR1cm5pbmcgdGhlIGVudHJ5IG9yIGEgbmV3IGNlbGwgb2YgZW50cmllc1xuICAgIEdldCguLi5hcmdzKSB7XG4gICAgICAvLyB0aGlzLl9fLmFyclNpemUxIC0gaW5kaWNlcyBvZiB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gdGhpcy5fXy5hcnJTaXplMiAtIHNpemUgb2YgdGhlIG5ldyBjZWxsXG4gICAgICAvLyB0aGlzLl9fLmFyclNpemUzIC0gaW5kaWNlcyBvZiB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICBsZXQgb3V0Y2VsbCA9IGZhbHNlO1xuICAgICAgbGV0IG91dGVxdWFsID0gdHJ1ZTtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fc2l6ZV9fLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmKGkgPiBhcmdzLmxlbmd0aCB8fCBhcmdzW2ldID09PSBzY2llbmNlLkFsbCB8fFxuICAgICAgICAgICAgKGFyZ3MuQllURVNfUEVSX0VMRU1FTlQgJiYgYXJnc1tpXSA9PT1cbiAgICAgICAgICAgICAgQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLk1BWF9JTlQuY2FsYyhhcmdzKSkpIHtcbiAgICAgICAgICBvdXRjZWxsID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUxW2ldID0gMDtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUyW2ldID0gdGhpcy5fX3NpemVfX1tpXTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUzW2ldID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRlcXVhbCA9IGZhbHNlO1xuICAgICAgICAgIGlmKGFyZ3NbaV0gPCAwKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gdGhpcy5fX3NpemVfX1tpXSAtIGFyZ3NbaV0gKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUxW2ldID0gYXJnc1tpXTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUyW2ldID0gMTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUzW2ldID0gYXJnc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoIW91dGNlbGwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5QXJyYXlfXyhhcmdzKV07XG4gICAgICB9IGVsc2UgaWYob3V0ZXF1YWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuQ2xvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBBYnN0cmFjdENlbGxQcm90by5IRUxQRVIuY3JlYXRlQ2VsbChcbiAgICAgICAgICB1dGlscy5maWx0ZXIodGhpcy5fXy5hcnJTaXplMiwgdXRpbHMuZmlsdGVycy5ncmVhdGVyT25lKSk7XG5cbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGNlbGwuX19sZW5ndGhfXzsgKytpKSB7XG4gICAgICAgICAgY2VsbC5fX2NlbGxzX19bY2VsbC5fX2luZGV4QnlJRF9fKGkpXSA9XG4gICAgICAgICAgICAgIHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5QXJyYXlfXyh0aGlzLl9fLmFyclNpemUzKV07XG4gICAgICAgICAgLy8gY2FsY3VsYXRlIG5leHQgaW5kZXhcbiAgICAgICAgICBmb3IobGV0IGogPSB0aGlzLl9fLmFyclNpemUzLmxlbmd0aCAtIDE7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICBpZih0aGlzLl9fLmFyclNpemUxW2pdID09PSAwKSB7XG4gICAgICAgICAgICAgIGlmKHRoaXMuX18uYXJyU2l6ZTNbal0gPj0gdGhpcy5fXy5hcnJTaXplMltqXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTNbal0gPSAxO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICsrdGhpcy5fXy5hcnJTaXplM1tqXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gc2V0IGNlbGwgZW50cnkvZW50cmllc1xuICAgIFNldCguLi5hcmdzKSB7XG4gICAgICAvLyB0aGlzLl9fLmFyclNpemUxIC0gaW5kaWNlcyBvZiB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gdGhpcy5fXy5hcnJTaXplMiAtIHNpemUgb2YgdGhlIHNldHRlciBjZWxsXG4gICAgICAvLyB0aGlzLl9fLmFyclNpemUzIC0gaW5kaWNlcyBvZiB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgICBsZXQgdmFsdWUgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XG4gICAgICBsZXQgaW5jZWxsID0gZmFsc2U7XG4gICAgICBsZXQgaW5lcXVhbCA9IHRydWU7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fX3NpemVfXy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZihpID4gYXJncy5sZW5ndGggLSAxIHx8IGFyZ3NbaV0gPT09IHNjaWVuY2UuQWxsIHx8XG4gICAgICAgICAgICAoYXJncy5CWVRFU19QRVJfRUxFTUVOVCAmJiBhcmdzW2ldID09PVxuICAgICAgICAgICAgICBBYnN0cmFjdENlbGxQcm90by5IRUxQRVIuTUFYX0lOVC5jYWxjKGFyZ3MpKSkge1xuICAgICAgICAgIGluY2VsbCA9IHRydWU7XG4gICAgICAgICAgdGhpcy5fXy5hcnJTaXplMVtpXSA9IDA7XG4gICAgICAgICAgdGhpcy5fXy5hcnJTaXplMltpXSA9IHRoaXMuX19zaXplX19baV07XG4gICAgICAgICAgdGhpcy5fXy5hcnJTaXplM1tpXSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5lcXVhbCA9IGZhbHNlO1xuICAgICAgICAgIGlmKGFyZ3NbaV0gPCAwKSB7XG4gICAgICAgICAgICBhcmdzW2ldID0gdGhpcy5fX3NpemVfX1tpXSAtIGFyZ3NbaV0gKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUxW2ldID0gYXJnc1tpXTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUyW2ldID0gMTtcbiAgICAgICAgICB0aGlzLl9fLmFyclNpemUzW2ldID0gYXJnc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYoIWluY2VsbCkge1xuICAgICAgICB0aGlzLl9fY2VsbHNfX1t0aGlzLl9faW5kZXhCeUFycmF5X18oYXJncyldID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZighKHZhbHVlIGluc3RhbmNlb2YgQ2VsbFByb3RvKSkge1xuICAgICAgICAgIHRocm93IG5ldyBBcmd1bWVudHNUeXBlRXhjZXB0aW9uKGFyZ3MubGVuZ3RoLCBfLlRZUEVTLkNFTEwpO1xuICAgICAgICB9XG4gICAgICAgIGlmKGluZXF1YWwpIHtcbiAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2xlbmd0aF9fOyArK2kpIHtcbiAgICAgICAgICAgIHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5SURfXyhpKV0gPVxuICAgICAgICAgICAgICAgIHZhbHVlLl9fY2VsbHNfX1t0aGlzLl9faW5kZXhCeUlEX18oaSldO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdmFsdWUuX19sZW5ndGhfXzsgKytpKSB7XG4gICAgICAgICAgICB0aGlzLl9fY2VsbHNfX1t0aGlzLl9faW5kZXhCeUFycmF5X18odGhpcy5fXy5hcnJTaXplMyldID1cbiAgICAgICAgICAgICAgICB2YWx1ZS5fX2NlbGxzX19bdmFsdWUuX19pbmRleEJ5SURfXyhpKV07XG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgbmV4dCBpbmRleFxuICAgICAgICAgICAgZm9yKGxldCBqID0gdGhpcy5fXy5hcnJTaXplMy5sZW5ndGggLSAxOyBqID49IDA7IC0taikge1xuICAgICAgICAgICAgICBpZih0aGlzLl9fLmFyclNpemUxW2pdID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fXy5hcnJTaXplM1tqXSA+PSB0aGlzLl9fLmFyclNpemUyW2pdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLl9fLmFyclNpemUzW2pdID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgKyt0aGlzLl9fLmFyclNpemUzW2pdO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gZ2V0IGNlbGwgZW50cnkvZW50cmllcywgcmV0dXJuaW5nIHRoZSBlbnRyeSBvciBhIGNlbGxwYXJ0IG9mIHRoZSBjZWxsXG4gICAgUGFydCguLi5hcmdzKSB7XG4gICAgICAvLyBUT0RPKEBiYnVlY2hlcmwpIGFkZCBjYWNoaW5nP1xuICAgICAgLy8gdGhpcy5fXy5hcnJTaXplMSAtIGluZGljZXMgb2YgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIHRoaXMuX18uYXJyU2l6ZTIgLSBzaXplIG9mIHRoZSBuZXcgY2VsbHBhcnRcbiAgICAgIGxldCBvdXRjZWxsID0gZmFsc2U7XG4gICAgICBsZXQgb3V0ZXF1YWwgPSB0cnVlO1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX19zaXplX18ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYoaSA+IGFyZ3MubGVuZ3RoIHx8IGFyZ3NbaV0gPT09IHNjaWVuY2UuQWxsIHx8XG4gICAgICAgICAgICAoYXJncy5CWVRFU19QRVJfRUxFTUVOVCAmJiBhcmdzW2ldID09PVxuICAgICAgICAgICAgICBBYnN0cmFjdENlbGxQcm90by5IRUxQRVIuTUFYX0lOVC5jYWxjKGFyZ3MpKSkge1xuICAgICAgICAgIG91dGNlbGwgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTFbaV0gPSAwO1xuICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTJbaV0gPSB0aGlzLl9fc2l6ZV9fW2ldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dGVxdWFsID0gZmFsc2U7XG4gICAgICAgICAgaWYoYXJnc1tpXSA8IDApIHtcbiAgICAgICAgICAgIGFyZ3NbaV0gPSB0aGlzLl9fc2l6ZV9fW2ldIC0gYXJnc1tpXSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTFbaV0gPSBhcmdzW2ldO1xuICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTJbaV0gPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZighb3V0Y2VsbCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2NlbGxzX19bdGhpcy5fX2luZGV4QnlBcnJheV9fKGFyZ3MpXTtcbiAgICAgIH0gZWxzZSBpZihvdXRlcXVhbCkge1xuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIENlbGxQYXJ0UHJvdG8gPyB0aGlzIDpcbiAgICAgICAgICAgIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5jcmVhdGVDZWxsUGFydCh0aGlzLCB0aGlzLl9fc2l6ZV9fLCAwLCAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDZWxsUGFydFByb3RvKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX19wYXJlbnRfXy5QYXJ0KEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUlxuICAgICAgICAgICAgICAuam9pblBhcnRzKHRoaXMuX19zdGFydF9fLCB0aGlzLl9fLmFyclNpemUxKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5jcmVhdGVDZWxsUGFydCh0aGlzLFxuICAgICAgICAgICAgICB1dGlscy5maWx0ZXIodGhpcy5fXy5hcnJTaXplMiwgdXRpbHMuZmlsdGVycy5ncmVhdGVyT25lKSxcbiAgICAgICAgICAgICAgbmV3IF8uQ09ORklHLkNFTExfU0laRV9DTEFTUyh0aGlzLl9fLmFyclNpemUxKSxcbiAgICAgICAgICAgICAgbmV3IF8uQ09ORklHLkNFTExfU0laRV9DTEFTUyh0aGlzLl9fLmFyclNpemUyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gdGhlIGNhbGxiYWNrIGlzIGV4ZWN1dGVkIG9uIGVhY2ggcm93IG9mIHRoZSBjZWxsXG4gICAgUm93KGNhbGxiYWNrKSB7XG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDw9IHRoaXMuX19zaXplX19bMF07ICsraSkge1xuICAgICAgICBjYWxsYmFjayh0aGlzLlBhcnQoaSksIGksIHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIHRoZSBjYWxsYmFjayBpcyBleGVjdXRlZCBvbiBlYWNoIGVudHJ5IG9mIHRoZSBjZWxsXG4gICAgRXZlcnkoY2FsbGJhY2spIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5SURfXyhpKV0sIGksIHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyB0aGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWQgb24gZWFjaCBlbnRyeSBvZiB0aGUgY2VsbCwgd2l0aCBjb29yZGluYXRlc1xuICAgIEVhY2goY2FsbGJhY2spIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fc2l6ZV9fLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHRoaXMuX18uYXJyU2l6ZTFbaV0gPSAxO1xuICAgICAgfVxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuX19sZW5ndGhfXzsgKytpKSB7XG4gICAgICAgIC8vIFRPRE8oQGJidWVjaGVybCkgY2hhbmdlIGNhbGwgcGFyYW1ldGVycyAobm8gYXJyYXkhKVxuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIHRoaXMuX19jZWxsc19fW3RoaXNcbiAgICAgICAgICAgIC5fX2luZGV4QnlBcnJheV9fKHRoaXMuX18uYXJyU2l6ZTEpXSwgdGhpcy5fXy5hcnJTaXplMSwgdGhpcyk7XG4gICAgICAgIC8vIGNhbGN1bGF0ZSBuZXh0IGluZGV4XG4gICAgICAgIGZvcihsZXQgaiA9IHRoaXMuX19zaXplX18ubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICBpZih0aGlzLl9fLmFyclNpemUxW2pdID49IHRoaXMuX19zaXplX19bal0pIHtcbiAgICAgICAgICAgIHRoaXMuX18uYXJyU2l6ZTFbal0gPSAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICArK3RoaXMuX18uYXJyU2l6ZTFbal07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBzb3J0IGFuZCBzZWFyY2ggZnVuY3Rpb25zXG4gICAgLy8gc29ydCB0aGUgY2VsbFxuICAgIFNvcnQob3JkZXIsIGNvbXBhcmVDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IF8uRVhDRVBUSU9OUy5UT0RPRXhjZXB0aW9uKFwiYmJ1ZWNoZXJsXCIpO1xuICAgIH1cbiAgICAvLyBmaWx0ZXIgdGhlIGNlbGwsIHJldHVybmluZyBhIG5ldyBjZWxsIG9mIGVudHJpZXNcbiAgICBGaWx0ZXIoZmlsdGVyQ2FsbGJhY2spIHtcbiAgICAgIHRocm93IG5ldyBfLkVYQ0VQVElPTlMuVE9ET0V4Y2VwdGlvbihcImJidWVjaGVybFwiKTtcbiAgICB9XG4gICAgLy8gcmVtb3ZlIGR1YmxpY2F0ZXMgYW5kIHNvcnQsIHJldHVybmluZyBhIG5ldyBjZWxsXG4gICAgVW5pcXVlKG9yZGVyKSB7XG4gICAgICB0aHJvdyBuZXcgXy5FWENFUFRJT05TLlRPRE9FeGNlcHRpb24oXCJiYnVlY2hlcmxcIik7XG4gICAgfVxuICAgIC8vIGZpbmQgZW50cnkgb3IgZW50cmllcywgcmV0dXJuaW5nIHRoZSBlbnRyeSBvciBhIG5ldyBjZWxsIG9mIGVudHJpZXNcbiAgICBGaW5kKGZpbmRDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IF8uRVhDRVBUSU9OUy5UT0RPRXhjZXB0aW9uKFwiYmJ1ZWNoZXJsXCIpO1xuICAgIH1cblxuICAgIC8vIGJhc2ljIGFyaXRobWV0aWNzXG4gICAgLy8gYWRkIGEgY2VsbCBvciBudW1iZXIgdG8gdGhpcyBjZWxsXG4gICAgQWRkKG8pIHtcbiAgICAgIHRocm93IG5ldyBfLkVYQ0VQVElPTlMuVE9ET0V4Y2VwdGlvbihcImJidWVjaGVybFwiKTtcbiAgICB9XG4gICAgLy8gc3Vic3RyYWN0IGEgY2VsbCBvciBudW1iZXIgZnJvbSB0aGlzIGNlbGxcbiAgICBTdWIobykge1xuICAgICAgdGhyb3cgbmV3IF8uRVhDRVBUSU9OUy5UT0RPRXhjZXB0aW9uKFwiYmJ1ZWNoZXJsXCIpO1xuICAgIH1cbiAgICAvLyBtdWx0aXBseSBhIGNlbGwgb3IgbnVtYmVyIHdpdGggdGhpcyBjZWxsXG4gICAgTXVsKG8pIHtcbiAgICAgIHRocm93IG5ldyBfLkVYQ0VQVElPTlMuVE9ET0V4Y2VwdGlvbihcImJidWVjaGVybFwiKTtcbiAgICB9XG4gICAgLy8gZGl2aWRlIGEgY2VsbCBvciBudW1iZXIgZnJvbSB0aGlzIGNlbGxcbiAgICBEaXYobykge1xuICAgICAgdGhyb3cgbmV3IF8uRVhDRVBUSU9OUy5UT0RPRXhjZXB0aW9uKFwiYmJ1ZWNoZXJsXCIpO1xuICAgIH1cblxuICAgIC8vIHV0aWxpdGllc1xuICAgIC8vIGNhbGN1bGF0ZSBhYnNvbHV0ZSB2YWx1ZSBvZiBlYWNoIGVudHJ5IG9mIHRoaXMgY2VsbFxuICAgIEFicygpIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9faW5kZXhCeUlEX18oaSk7XG4gICAgICAgIHRoaXMuX19jZWxsc19fW2luZGV4XSA9IE1hdGguYWJzKHRoaXMuX19jZWxsc19fW2luZGV4XSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gY2FsY3VsYXRlIHRoZSBzdW0gb2YgYWxsIGVudHJpZXMgb2YgdGhpcyBjZWxsXG4gICAgU3VtKCkge1xuICAgICAgbGV0IHN1bSA9IDA7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fX2xlbmd0aF9fOyArK2kpIHtcbiAgICAgICAgc3VtICs9IHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5SURfXyhpKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gc3VtO1xuICAgIH1cbiAgICAvLyBjYWxjdWxhdGUgdGhlIHByb2R1Y3Qgb2YgYWxsIGVudHJpZXMgb2YgdGhpcyBjZWxsXG4gICAgUHJvZCgpIHtcbiAgICAgIGxldCBwcm9kID0gMTtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLl9fbGVuZ3RoX187ICsraSkge1xuICAgICAgICBwcm9kICo9IHRoaXMuX19jZWxsc19fW3RoaXMuX19pbmRleEJ5SURfXyhpKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcHJvZDtcbiAgICB9XG4gIH07XG5cbiAgLy8gbmFtZXNwYWNlIGZvciBhYnN0cmFjdCBjZWxsIGludGVybmFsIGhlbHBlcnNcbiAgQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSID0ge1xuICAgIC8vIGNhY2hlIE1BWF9JTlQgZm9yIHR5cGVkIGFycmF5c1xuICAgIE1BWF9JTlQ6IHtcbiAgICAgIGNhbGMoYSkge1xuICAgICAgICBsZXQgYnBlID0gYS5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICAgICAgaWYoIUFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5NQVhfSU5UW2JwZV0pIHtcbiAgICAgICAgICByZXR1cm4gKEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5NQVhfSU5UW2JwZV0gPSBNYXRoLnBvdygyLCBicGUqOCktMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5NQVhfSU5UW2JwZV07XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIGludGVybmFsIGNvbnN0cnVjdG9yIGZvciBjZWxsc1xuICAgIGNyZWF0ZUNlbGwoYXJnMCwgZGltKSB7XG4gICAgICBjb25zdCBjID0gZnVuY3Rpb24gQ2VsbCguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBjLkdldC5hcHBseShjLCBhcmdzKTtcbiAgICAgIH07XG4gICAgICBjLl9fcHJvdG9fXyA9IG5ldyBDZWxsUHJvdG8oYXJnMCwgZGltKTtcbiAgICAgIHJldHVybiBjO1xuICAgIH0sXG5cbiAgICAvLyBpbnRlcm5hbCBjb25zdHJ1Y3RvciBmb3IgY2VsbCBwYXJ0c1xuICAgIGNyZWF0ZUNlbGxQYXJ0KHBhcmVudCwgc2l6ZXMsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIGNvbnN0IGMgPSBmdW5jdGlvbiBDZWxsUGFydCguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBjLkdldC5hcHBseShjLCBhcmdzKTtcbiAgICAgIH07XG4gICAgICBjLl9fcHJvdG9fXyA9IG5ldyBDZWxsUGFydFByb3RvKHBhcmVudCwgc2l6ZXMsIHN0YXJ0LCBlbmQpO1xuICAgICAgcmV0dXJuIGM7XG4gICAgfSxcblxuICAgIC8vIGdldCBzaXplIG9mIHRoZSBpbnRlcm5hbCBkYXRhIHN0cnVjdHVyZSBvZiBnaXZlbiBkaW1lbnNpb24tc2l6ZXNcbiAgICBnZXRTaXplKHNpemVzKSB7XG4gICAgICBsZXQgaW5kZXggPSBzaXplc1swXSAtIDE7XG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc2l6ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCAqIHNpemVzW2ktMV0gKyBzaXplc1tpXSAtIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW5kZXggKyAxO1xuICAgIH0sXG5cbiAgICAvLyBnZXQgaW5kZXhcbiAgICBnZXRJbmRleChhcmdzLCBzaXplcykge1xuICAgICAgbGV0IGluZGV4ID0gYXJnc1swXSAtIDE7XG4gICAgICBmb3IobGV0IGkgPSAxOyBpIDwgc2l6ZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaW5kZXggPSBpbmRleCAqIHNpemVzW2ktMV0gKyBhcmdzW2ldIC0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgLy8gam9pbiBpbmRleCBvZmZzZXRzIG9mIGNlbGwgcGFydHNcbiAgICBqb2luUGFydHMoc3RhcnQsIG5leHQsIG91dCkge1xuICAgICAgb3V0ID0gb3V0IHx8IG5ldyBfLkNPTkZJRy5DRUxMX1NJWkVfQ0xBU1MobmV4dCk7XG4gICAgICBsZXQgbmkgPSAwO1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmKHN0YXJ0W2ldID09IDApIHtcbiAgICAgICAgICBpZihuZXh0W2ldID09IDApIHtcbiAgICAgICAgICAgIG91dFtpXSA9IEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5NQVhfSU5ULmNhbGMob3V0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb3V0W2ldID0gbmV4dFtuaSsrXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3V0W2ldID0gc3RhcnRbaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfSxcblxuICAgIC8vIHByZXBhcmUgaGVhZGVyIGZvciAudG9TdHJpbmcoKVxuICAgIGdldEhlYWRlcihuYW1lLCBzaXplcykge1xuICAgICAgbGV0IG91dCA9IG5hbWUgKyBcIihcIjtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaXplcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZihpICE9IDApIG91dCArPSBcInhcIjtcbiAgICAgICAgb3V0ICs9IHNpemVzW2ldO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dCArIFwiKVwiO1xuICAgIH0sXG5cbiAgICBpc1R5cGVkQXJyYXkoYSkge1xuICAgICAgLypcbiAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgSW50OEFycmF5IHx8IGEgaW5zdGFuY2VvZiBVaW50OEFycmF5IHx8IGEgaW5zdGFuY2VvZlxuICAgICAgICAgIFVpbnQ4Q2xhbXBlZEFycmF5IHx8IGEgaW5zdGFuY2VvZiBJbnQxNkFycmF5IHx8IGEgaW5zdGFuY2VvZlxuICAgICAgICAgIFVpbnQxNkFycmF5IHx8IGEgaW5zdGFuY2VvZiBJbnQzMkFycmF5IHx8IGEgaW5zdGFuY2VvZiBVaW50MzJBcnJheSB8fFxuICAgICAgICAgIGEgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHwgYSBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheTtcbiAgICAgICovXG4gICAgICByZXR1cm4gYS5idWZmZXIgJiYgYS5CWVRFU19QRVJfRUxFTUVOVDtcbiAgICB9LFxuXG4gICAgQllURVM6IFtcbiAgICAgIFwiQnl0ZXNcIixcbiAgICAgIFwiS0J5dGVzXCIsXG4gICAgICBcIk1CeXRlc1wiLFxuICAgICAgXCJHQnl0ZXNcIixcbiAgICAgIFwiVEJ5dGVzXCIsXG4gICAgICBcIlBCeXRlc1wiXG4gICAgXSxcblxuICAgIGdldEJ5dGVzKGIsIHMpIHtcbiAgICAgIGlmKGIvMTAwMCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5nZXRCeXRlcyhiLzEwMDAsICEhcyA/IHMgKyAxIDogMSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYiArIFwiIFwiICsgQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLkJZVEVTWyEhcyA/IHMgOiAwXTtcbiAgICB9LFxuXG4gICAgZ2V0SW5BcnJheShhcnIsIGluZGljZXMsIGRlZikge1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgd2hpbGUoKGkgPCBpbmRpY2VzLmxlbmd0aCkgJiYgKGFyciA9IGFycltpbmRpY2VzW2krK10gLSAxXSkpO1xuICAgICAgY29uc29sZS5sb2coaW5kaWNlcywgYXJyIHx8IGRlZik7XG4gICAgICByZXR1cm4gYXJyIHx8IGRlZjtcbiAgICB9XG4gIH07XG5cbiAgLy8gaW50ZXJuYWwgcHJvdG90eXBlIGNsYXNzIGZvciBjZWxsIHBhcnRzXG4gIGNsYXNzIENlbGxQYXJ0UHJvdG8gZXh0ZW5kcyBBYnN0cmFjdENlbGxQcm90byB7XG4gICAgY29uc3RydWN0b3IocGFyZW50LCBzaXplcywgc3RhcnQsIGVuZCkge1xuICAgICAgc3VwZXIoXCJDZWxsUGFydFwiLCBfLlRZUEVTLkNFTExQQVJULCBzaXplcyk7XG4gICAgICB0aGlzLl9fcGFyZW50X18gPSBwYXJlbnQ7XG4gICAgICB0aGlzLl9fc3RhcnRfXyA9IHN0YXJ0O1xuICAgICAgdGhpcy5fX2VuZF9fID0gZW5kO1xuICAgICAgdGhpcy5fX2NlbGxzX18gPSBwYXJlbnQuX19jZWxsc19fO1xuICAgIH1cblxuICAgIC8vIGludGVybmFsIGZ1bmN0aW9uYWxpdHlcbiAgICBfX2luZGV4QnlJRF9fKGlkKSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5fX3N0YXJ0X18ubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdGhpcy5fX3BhcmVudF9fLl9fLmFyclNpemUxW2ldID0gdGhpcy5fX3N0YXJ0X19baV0gPT09IDAgPyAxIDpcbiAgICAgICAgICAgIHRoaXMuX19zdGFydF9fW2ldO1xuICAgICAgfVxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGlkOyArK2kpIHtcbiAgICAgICAgLy8gY2FsY3VsYXRlIG5leHQgaW5kZXhcbiAgICAgICAgZm9yKGxldCBqID0gdGhpcy5fX3N0YXJ0X18ubGVuZ3RoIC0gMTsgaiA+PSAwOyAtLWopIHtcbiAgICAgICAgICBpZih0aGlzLl9fc3RhcnRfX1tqXSA9PT0gMCkge1xuICAgICAgICAgICAgaWYodGhpcy5fX3BhcmVudF9fLl9fLmFyclNpemUxW2pdID49IHRoaXMuX19wYXJlbnRfXy5fX3NpemVfX1tqXSkge1xuICAgICAgICAgICAgICB0aGlzLl9fcGFyZW50X18uX18uYXJyU2l6ZTFbal0gPSAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgKyt0aGlzLl9fcGFyZW50X18uX18uYXJyU2l6ZTFbal07XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX19wYXJlbnRfXy5fX2luZGV4QnlBcnJheV9fKHRoaXMuX19wYXJlbnRfXy5fXy5hcnJTaXplMSk7XG4gICAgfVxuICAgIF9faW5kZXhCeUFycmF5X18oYXJyKSB7XG4gICAgICByZXR1cm4gQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLmdldEluZGV4KEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUlxuICAgICAgICAgIC5qb2luUGFydHModGhpcy5fX3N0YXJ0X18sIGFyciwgdGhpcy5fX3BhcmVudF9fLl9fLmFyclNpemUxKSxcbiAgICAgICAgICB0aGlzLl9fcGFyZW50X18uX19zaXplX18pO1xuICAgIH1cbiAgfTtcblxuICAvLyBpbnRlcm5hbCBwcm90b3R5cGUgY2xhc3MgZm9yIGNlbGxzXG4gIGNsYXNzIENlbGxQcm90byBleHRlbmRzIEFic3RyYWN0Q2VsbFByb3RvIHtcbiAgICAvLyBjb25zdHJ1Y3RvclxuICAgIGNvbnN0cnVjdG9yKGFyZzAsIGRpbSkge1xuICAgICAgaWYoQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLmlzVHlwZWRBcnJheShhcmcwKSAmJlxuICAgICAgICAgIEFic3RyYWN0Q2VsbFByb3RvLkhFTFBFUi5nZXRTaXplKGRpbSkgPT09IGFyZzAubGVuZ3RoKSB7XG4gICAgICAgIHN1cGVyKFwiQ2VsbFwiLCBfLlRZUEVTLkNFTEwsIGRpbSk7XG4gICAgICAgIHRoaXMuX19jZWxsc19fID0gYXJnMDtcbiAgICAgIH0gZWxzZSBpZihhcmcwIGluc3RhbmNlb2YgQ2VsbFByb3RvKSB7XG4gICAgICAgIHN1cGVyKFwiQ2VsbFwiLCBfLlRZUEVTLkNFTEwsIGFyZzAuX19zaXplX18pO1xuICAgICAgICB0aGlzLl9fY2VsbHNfXyA9IG5ldyBfLkNPTkZJRy5DRUxMX0JBU0VfQ0xBU1MoYXJnMC5fX2NlbGxzX18pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3VwZXIoXCJDZWxsXCIsIF8uVFlQRVMuQ0VMTCwgYXJnMCk7XG4gICAgICAgIHRoaXMuX19jZWxsc19fID0gbmV3IF8uQ09ORklHLkNFTExfQkFTRV9DTEFTUyh0aGlzLl9fbGVuZ3RoX18pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGludGVybmFsIGZ1bmN0aW9uYWxpdHlcbiAgICBfX2luZGV4QnlJRF9fKGlkKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIF9faW5kZXhCeUFycmF5X18oYXJyKSB7XG4gICAgICByZXR1cm4gQWJzdHJhY3RDZWxsUHJvdG8uSEVMUEVSLmdldEluZGV4KGFyciwgdGhpcy5fX3NpemVfXyk7XG4gICAgfVxuICB9O1xuXG4gIF8uU1RSVUNUVVJFLkFic3RyYWN0Q2VsbFByb3RvID0gQWJzdHJhY3RDZWxsUHJvdG87XG4gIF8uU1RSVUNUVVJFLkNlbGxQYXJ0UHJvdG8gPSBDZWxsUGFydFByb3RvO1xuICBfLlNUUlVDVFVSRS5DZWxsUHJvdG8gPSBDZWxsUHJvdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAoc2NpZW5jZSwgXywgdXRpbHMpID0+IHtcbiAgcmVxdWlyZShcIi4vY2VsbFwiKShzY2llbmNlLCBfLCB1dGlscyk7XG59O1xuIiwidmFyIHV0aWxzID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5vcDogKCkgPT4gdW5kZWZpbmVkLFxuXG4gIGZpbHRlcihhcnIsIGZpbHRlcikge1xuICAgIGxldCBvdXQgPSBbXTtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKVxuICAgICAgaWYoZmlsdGVyKGFycltpXSkpXG4gICAgICAgIG91dC5wdXNoKGFycltpXSk7XG4gICAgcmV0dXJuIG91dDtcbiAgfSxcbiAgZmlsdGVyczoge1xuICAgIGdyZWF0ZXJPbmUodikge1xuICAgICAgcmV0dXJuIHYgPiAxO1xuICAgIH1cbiAgfSxcblxuICBjbGVhcihhcnIpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKSB7XG4gICAgICBhcnJbaV0gPSAwO1xuICAgIH1cbiAgfSxcblxuICBjb3B5KGZyb20sIHRvKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGZyb20ubGVuZ3RoOyArK2kpIHtcbiAgICAgIHRvW2ldID0gZnJvbVtpXTtcbiAgICB9XG4gIH1cbn07XG4iXX0=
