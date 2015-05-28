module.exports = (science, _, utils) => {
  // default datastructure classes
  _.CONFIG.CELL_BASE_CLASS = Float64Array;
  _.CONFIG.CELL_SIZE_CLASS = Uint16Array;

  // internal abstract cell prototype class for cell and cell part classes
  class AbstractCellProto {
    constructor(name, type, sizes) {
      this.__header__ = AbstractCellProto.HELPER.getHeader(name, sizes);
      this.__type__ = type;
      this.__size__ = new _.CONFIG.CELL_SIZE_CLASS(sizes);
      this.__length__ = AbstractCellProto.HELPER.getSize(sizes);
      this.__dimension__ = sizes.length;
      // setup helpers once to improve performance
      if(!AbstractCellProto.HELPER[this.__dimension__]) {
        AbstractCellProto.HELPER[this.__dimension__] = {
          arrSize1: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__),
          arrSize2: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__),
          arrSize3: new _.CONFIG.CELL_SIZE_CLASS(this.__dimension__)
        }
      }
      // quick reference to the helper
      this.__ = AbstractCellProto.HELPER[this.__dimension__];
      _.INTERNAL.Alloc(this);
    }

    // internal functionality
    __indexByID__(id) {
      throw new _.EXCEPTIONS.UnimplementedException();
    }
    __indexByArray__(arr) {
      throw new _.EXCEPTIONS.UnimplementedException();
    }

    // basic functionality
    // output function
    toString() {
      let str = this.__header__ + " = [";
      for(let i = 0; i < this.__length__; ++i) {
        if(i !== 0) str += ", ";
        str += this.__cells__[this.__indexByID__(i)];
      }
      return str + "]";
    }
    Info() {
      return this.__header__ + " " +
          AbstractCellProto.HELPER.getBytes(this.__type__ === _.TYPES.CELL ?
            this.__cells__.BYTES_PER_ELEMENT * this.__length__ : 0);
    }
    // length of the cell (counting all entries)
    Length() {
      return this.__length__;
    }
    // dimension of the cell
    Dimension() {
      return this.__dimension__;
    }
    // dimension-sizes of the cell, returning an array
    Size() {
      return this.__size__;
    }
    // clone the cell, returning the new cloned cell
    Clone() {
      if(arg0 instanceof CellPartProto) {
        return arg0.__parent__.Get.apply(arg0.__parent__, arg0.__start__);
      }
      return AbstractCellProto.HELPER.createCell(arg0);
    }
    // get cell entry/entries, returning the entry or a new cell of entries
    Get(...args) {
      // this.__.arrSize1 - indices of the first element
      // this.__.arrSize2 - size of the new cell
      // this.__.arrSize3 - indices of the current element
      let outcell = false;
      let outequal = true;
      for(let i = 0; i < this.__size__.length; ++i) {
        if(i > args.length || args[i] === science.All ||
            (args.BYTES_PER_ELEMENT && args[i] ===
              AbstractCellProto.HELPER.MAX_INT.calc(args))) {
          outcell = true;
          this.__.arrSize1[i] = 0;
          this.__.arrSize2[i] = this.__size__[i];
          this.__.arrSize3[i] = 1;
        } else {
          outequal = false;
          if(args[i] < 0) {
            args[i] = this.__size__[i] - args[i] + 1;
          }
          this.__.arrSize1[i] = args[i];
          this.__.arrSize2[i] = 1;
          this.__.arrSize3[i] = args[i];
        }
      }
      if(!outcell) {
        return this.__cells__[this.__indexByArray__(args)];
      } else if(outequal) {
        return this.Clone();
      } else {
        const cell = AbstractCellProto.HELPER.createCell(
          utils.filter(this.__.arrSize2, utils.filters.greaterOne));

        for(let i = 0; i < cell.__length__; ++i) {
          cell.__cells__[cell.__indexByID__(i)] =
              this.__cells__[this.__indexByArray__(this.__.arrSize3)];
          // calculate next index
          for(let j = this.__.arrSize3.length - 1; j >= 0; --j) {
            if(this.__.arrSize1[j] === 0) {
              if(this.__.arrSize3[j] >= this.__.arrSize2[j]) {
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
    // set cell entry/entries
    Set(...args) {
      // this.__.arrSize1 - indices of the first element
      // this.__.arrSize2 - size of the setter cell
      // this.__.arrSize3 - indices of the current element
      let value = args[args.length - 1];
      let incell = false;
      let inequal = true;
      for(let i = 0; i < this.__size__.length; ++i) {
        if(i > args.length - 1 || args[i] === science.All ||
            (args.BYTES_PER_ELEMENT && args[i] ===
              AbstractCellProto.HELPER.MAX_INT.calc(args))) {
          incell = true;
          this.__.arrSize1[i] = 0;
          this.__.arrSize2[i] = this.__size__[i];
          this.__.arrSize3[i] = 1;
        } else {
          inequal = false;
          if(args[i] < 0) {
            args[i] = this.__size__[i] - args[i] + 1;
          }
          this.__.arrSize1[i] = args[i];
          this.__.arrSize2[i] = 1;
          this.__.arrSize3[i] = args[i];
        }
      }
      if(!incell) {
        this.__cells__[this.__indexByArray__(args)] = value;
      } else {
        if(!(value instanceof CellProto)) {
          throw new ArgumentsTypeException(args.length, _.TYPES.CELL);
        }
        if(inequal) {
          for(let i = 0; i < this.__length__; ++i) {
            this.__cells__[this.__indexByID__(i)] =
                value.__cells__[this.__indexByID__(i)];
          }
        } else {
          for(let i = 0; i < value.__length__; ++i) {
            this.__cells__[this.__indexByArray__(this.__.arrSize3)] =
                value.__cells__[value.__indexByID__(i)];
            // calculate next index
            for(let j = this.__.arrSize3.length - 1; j >= 0; --j) {
              if(this.__.arrSize1[j] === 0) {
                if(this.__.arrSize3[j] >= this.__.arrSize2[j]) {
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
    // get cell entry/entries, returning the entry or a cellpart of the cell
    Part(...args) {
      // TODO(@bbuecherl) add caching?
      // this.__.arrSize1 - indices of the first element
      // this.__.arrSize2 - size of the new cellpart
      let outcell = false;
      let outequal = true;
      for(let i = 0; i < this.__size__.length; ++i) {
        if(i > args.length || args[i] === science.All ||
            (args.BYTES_PER_ELEMENT && args[i] ===
              AbstractCellProto.HELPER.MAX_INT.calc(args))) {
          outcell = true;
          this.__.arrSize1[i] = 0;
          this.__.arrSize2[i] = this.__size__[i];
        } else {
          outequal = false;
          if(args[i] < 0) {
            args[i] = this.__size__[i] - args[i] + 1;
          }
          this.__.arrSize1[i] = args[i];
          this.__.arrSize2[i] = 1;
        }
      }
      if(!outcell) {
        return this.__cells__[this.__indexByArray__(args)];
      } else if(outequal) {
        return this instanceof CellPartProto ? this :
            AbstractCellProto.HELPER.createCellPart(this, this.__size__, 0, 0);
      } else {
        if(this instanceof CellPartProto) {
          return this.__parent__.Part(AbstractCellProto.HELPER
              .joinParts(this.__start__, this.__.arrSize1));
        } else {
          return AbstractCellProto.HELPER.createCellPart(this,
              utils.filter(this.__.arrSize2, utils.filters.greaterOne),
              new _.CONFIG.CELL_SIZE_CLASS(this.__.arrSize1),
              new _.CONFIG.CELL_SIZE_CLASS(this.__.arrSize2));
        }
      }
    }
    // the callback is executed on each row of the cell
    Row(callback) {
      for(let i = 1; i <= this.__size__[0]; ++i) {
        callback(this.Part(i), i, this);
      }
      return this;
    }
    // the callback is executed on each entry of the cell
    Every(callback) {
      for(let i = 0; i < this.__length__; ++i) {
        callback.call(this, this.__cells__[this.__indexByID__(i)], i, this);
      }
    }
    // the callback is executed on each entry of the cell, with coordinates
    Each(callback) {
      for(let i = 0; i < this.__size__.length; ++i) {
        this.__.arrSize1[i] = 1;
      }
      for(let i = 0; i < this.__length__; ++i) {
        // TODO(@bbuecherl) change call parameters (no array!)
        callback.call(this, this.__cells__[this
            .__indexByArray__(this.__.arrSize1)], this.__.arrSize1, this);
        // calculate next index
        for(let j = this.__size__.length - 1; j >= 0; --j) {
          if(this.__.arrSize1[j] >= this.__size__[j]) {
            this.__.arrSize1[j] = 1;
          } else {
            ++this.__.arrSize1[j];
            break;
          }
        }
      }
    }

    // sort and search functions
    // sort the cell
    Sort(order, compareCallback) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // filter the cell, returning a new cell of entries
    Filter(filterCallback) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // remove dublicates and sort, returning a new cell
    Unique(order) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // find entry or entries, returning the entry or a new cell of entries
    Find(findCallback) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }

    // basic arithmetics
    // add a cell or number to this cell
    Add(o) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // substract a cell or number from this cell
    Sub(o) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // multiply a cell or number with this cell
    Mul(o) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }
    // divide a cell or number from this cell
    Div(o) {
      throw new _.EXCEPTIONS.TODOException("bbuecherl");
    }

    // utilities
    // calculate absolute value of each entry of this cell
    Abs() {
      for(let i = 0; i < this.__length__; ++i) {
        let index = this.__indexByID__(i);
        this.__cells__[index] = Math.abs(this.__cells__[index]);
      }
      return this;
    }
    // calculate the sum of all entries of this cell
    Sum() {
      let sum = 0;
      for(let i = 0; i < this.__length__; ++i) {
        sum += this.__cells__[this.__indexByID__(i)];
      }
      return sum;
    }
    // calculate the product of all entries of this cell
    Prod() {
      let prod = 1;
      for(let i = 0; i < this.__length__; ++i) {
        prod *= this.__cells__[this.__indexByID__(i)];
      }
      return prod;
    }
  };

  // namespace for abstract cell internal helpers
  AbstractCellProto.HELPER = {
    // cache MAX_INT for typed arrays
    MAX_INT: {
      calc(a) {
        let bpe = a.BYTES_PER_ELEMENT;
        if(!AbstractCellProto.HELPER.MAX_INT[bpe]) {
          return (AbstractCellProto.HELPER.MAX_INT[bpe] = Math.pow(2, bpe*8)-1);
        }
        return AbstractCellProto.HELPER.MAX_INT[bpe];
      }
    },

    // internal constructor for cells
    createCell(arg0, dim) {
      const c = function Cell(...args) {
        return c.Get.apply(c, args);
      };
      c.__proto__ = new CellProto(arg0, dim);
      return c;
    },

    // internal constructor for cell parts
    createCellPart(parent, sizes, start, end) {
      const c = function CellPart(...args) {
        return c.Get.apply(c, args);
      };
      c.__proto__ = new CellPartProto(parent, sizes, start, end);
      return c;
    },

    // get size of the internal data structure of given dimension-sizes
    getSize(sizes) {
      let index = sizes[0] - 1;
      for(let i = 1; i < sizes.length; ++i) {
        index = index * sizes[i-1] + sizes[i] - 1;
      }
      return index + 1;
    },

    // get index
    getIndex(args, sizes) {
      let index = args[0] - 1;
      for(let i = 1; i < sizes.length; ++i) {
        index = index * sizes[i-1] + args[i] - 1;
      }
      return index;
    },

    // join index offsets of cell parts
    joinParts(start, next, out) {
      out = out || new _.CONFIG.CELL_SIZE_CLASS(next);
      let ni = 0;
      for(let i = 0; i < start.length; ++i) {
        if(start[i] == 0) {
          if(next[i] == 0) {
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
    getHeader(name, sizes) {
      let out = name + "(";
      for(let i = 0; i < sizes.length; ++i) {
        if(i != 0) out += "x";
        out += sizes[i];
      }
      return out + ")";
    },

    isTypedArray(a) {
      /*
      return a instanceof Int8Array || a instanceof Uint8Array || a instanceof
          Uint8ClampedArray || a instanceof Int16Array || a instanceof
          Uint16Array || a instanceof Int32Array || a instanceof Uint32Array ||
          a instanceof Float32Array || a instanceof Float64Array;
      */
      return a.buffer && a.BYTES_PER_ELEMENT;
    },

    BYTES: [
      "Bytes",
      "KBytes",
      "MBytes",
      "GBytes",
      "TBytes",
      "PBytes"
    ],

    getBytes(b, s) {
      if(b/1000 > 1) {
        return AbstractCellProto.HELPER.getBytes(b/1000, !!s ? s + 1 : 1);
      }
      return b + " " + AbstractCellProto.HELPER.BYTES[!!s ? s : 0];
    },

    getInArray(arr, indices, def) {
      let i = 0;
      while((i < indices.length) && (arr = arr[indices[i++] - 1]));
      console.log(indices, arr || def);
      return arr || def;
    }
  };

  // internal prototype class for cell parts
  class CellPartProto extends AbstractCellProto {
    constructor(parent, sizes, start, end) {
      super("CellPart", _.TYPES.CELLPART, sizes);
      this.__parent__ = parent;
      this.__start__ = start;
      this.__end__ = end;
      this.__cells__ = parent.__cells__;
    }

    // internal functionality
    __indexByID__(id) {
      for(let i = 0; i < this.__start__.length; ++i) {
        this.__parent__.__.arrSize1[i] = this.__start__[i] === 0 ? 1 :
            this.__start__[i];
      }
      for(let i = 0; i < id; ++i) {
        // calculate next index
        for(let j = this.__start__.length - 1; j >= 0; --j) {
          if(this.__start__[j] === 0) {
            if(this.__parent__.__.arrSize1[j] >= this.__parent__.__size__[j]) {
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
    __indexByArray__(arr) {
      return AbstractCellProto.HELPER.getIndex(AbstractCellProto.HELPER
          .joinParts(this.__start__, arr, this.__parent__.__.arrSize1),
          this.__parent__.__size__);
    }
  };

  // internal prototype class for cells
  class CellProto extends AbstractCellProto {
    // constructor
    constructor(arg0, dim) {
      if(AbstractCellProto.HELPER.isTypedArray(arg0) &&
          AbstractCellProto.HELPER.getSize(dim) === arg0.length) {
        super("Cell", _.TYPES.CELL, dim);
        this.__cells__ = arg0;
      } else if(arg0 instanceof CellProto) {
        super("Cell", _.TYPES.CELL, arg0.__size__);
        this.__cells__ = new _.CONFIG.CELL_BASE_CLASS(arg0.__cells__);
      } else {
        super("Cell", _.TYPES.CELL, arg0);
        this.__cells__ = new _.CONFIG.CELL_BASE_CLASS(this.__length__);
      }
    }

    // internal functionality
    __indexByID__(id) {
      return id;
    }
    __indexByArray__(arr) {
      return AbstractCellProto.HELPER.getIndex(arr, this.__size__);
    }
  };

  _.STRUCTURE.AbstractCellProto = AbstractCellProto;
  _.STRUCTURE.CellPartProto = CellPartProto;
  _.STRUCTURE.CellProto = CellProto;
};
