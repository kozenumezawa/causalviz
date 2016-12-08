export default class Matrix {
  constructor(elements) {
    this.rows = 0;
    this.cols = 0;
    this.set(elements || []);
  }

  set(elements) {
    this.rows = elements.length;
    this.cols = this.rows == 0 ? 0 : elements[0].length;

    var row, c;
    for (var r = this.rows - 1; r >= 0; --r) {
      row = new Array(this.cols);
      for (c = this.cols - 1; c >= 0; --c) {
        row[c] = elements[r][c];
      }
      this[r] = row;
    }

    return this;
  }

  create(rows, cols, initVal) {
    var elements;

    if (typeof rows == 'number') {
      if (initVal === void 0) {
        if (cols === void 0) {
          cols = rows;
          initVal = 0;
        } else {
          initVal = cols;
        }
      }

      if (rows > 0 && cols > 0) {
        elements = new Array(rows);
        var row, c;
        for (var r = rows - 1; r >= 0; --r) {
          row = new Array(cols);
          for (c = cols - 1; c >= 0; --c) {
            row[c] = initVal;
          }
          elements[r] = row;
        }
      } else {
        var m = new Matrix();
        m.rows = rows;
        m.cols = cols;
        return m;
      }
    } else {
      rows = rows || [];
      if (typeof rows[0] == 'number') {
        elements = [ rows ];
      } else {
        elements = rows;
      }
    }
    return new Matrix(elements);
  }

  zeros(rows, cols) {
    return Matrix.create(rows, cols || rows, 0);
  }

  ones(rows, cols) {
    return Matrix.create(rows, cols || rows, 1);
  }

  eye(rows, cols) {
    cols = cols || rows;
    if (rows == cols) {
      return Matrix.diag(1, rows);
    } else {
      var m = Matrix.zeros(rows, cols);
      for (var i = Math.min(rows, cols) - 1; i >= 0; --i) {
        m[i][i] = 1;
      }
      return m;
    }
  }

  diag(value, size) {
    if (typeof value == 'number') {
      var m = Matrix.zeros(size);
      for (var i = size - 1; i >= 0; --i) {
        m[i][i] = value;
      }
      return m;
    } else {
      size = size || 0;
      var len = value.length + size;
      var m = Matrix.zeros(len);
      for (var i = len - 1; i >= 0; --i) {
        m[i][i + size] = value[i];
      }
      return m;
    }
  }

  rand(rows, cols, f) {
    rows = rows || 0;
    cols = cols || rows;
    var rand = f || Math.random;
    var elements = new Array(rows);
    var row, c;
    for (var r = rows - 1; r >= 0; --r) {
      row = new Array(cols);
      for (c = cols - 1; c >= 0; --c) {
        row[c] = rand();
      }
      elements[r] = row;
    }
    return Matrix.create(elements);
  }

  randn(rows, cols) {
    return Matrix.rand(rows, cols, Mx.Utils.randn);
  }

  toString() {
    // Find max length in the all of elements in order to align matrix.
    var maxLength = [];
    for (var c = 0, clen = this.cols; c < clen; ++c) {
      maxLength[c] = 0;
      for (var r = 0, rlen = this.rows; r < rlen; ++r) {
        maxLength[c] = Math.max((this[r][c] + '').length, maxLength[c]);
      }
    }

    var s = '';
    for (var r = 0, rlen = this.rows; r < rlen; ++r) {
      for (var c = 0, clen = this.cols; c < clen; ++c) {
        s += (new Array(maxLength[c] - (this[r][c] + '').length + 2)).join(' ');
        s += this[r][c];
      }
      s += "\n";
    }
    return s;
  }

  disp() {
    console.log(this.toString());
  }

  clone() {
    return new Matrix(this.toArray());
  }

  toArray() {
    var elements = new Array(this.rows);
    for (var r = this.rows - 1; r >= 0; --r) {
      elements[r] = this[r].concat();
    }
    return elements;
  }

  toVec(type) {
    if (type === void 0) {
      if (this.rows === 1) {
        return this.row(0);
      } else if (this.cols === 1) {
        return this.col(0);
      }
      type = Vector.COL;
    }

    var vectors, r, elements;
    if (type === Vector.COL) {
      vectors = new Array(this.cols);
      for (var c = this.cols - 1; c >= 0; --c) {
        vectors[c] = this.col(c);
      }
    } else {
      vectors = new Array(this.rows);
      for (var r = this.rows - 1; r >= 0; --r) {
        vectors[r] = this.row(r);
      }
    }

    return vectors;
  }

  isSquare() {
    return this.rows === this.cols;
  }

  isEmpty() {
    return this.rows === 0;
  }

  getElementCount() {
    return this.rows * this.cols;
  }

  map(f) {
    var row, c;
    for (var r = this.rows - 1; r >= 0; --r) {
      row = this[r];
      for (c = this.cols - 1; c >= 0; --c) {
        row[c] = f.call(this, row[c], r, c);
      }
    }
    return this;
  }

  mapCols(f) {
    for (var c = this.cols - 1; c >= 0; --c) {
      this.setCol(c, f.call(this, this.col(c), c));
    }
  }

  mapRows(f) {
    for (var r = this.rows - 1; r >= 0; --r) {
      this.setRow(r, f.call(this, this.row(r), r));
    }
  }

  set(elements) {
    this.rows = elements.length;
    this.cols = this.rows == 0 ? 0 : elements[0].length;

    var row, c;
    for (var r = this.rows - 1; r >= 0; --r) {
      row = new Array(this.cols);
      for (c = this.cols - 1; c >= 0; --c) {
        row[c] = elements[r][c];
      }
      this[r] = row;
    }

    return this;
  }

  hcat() {
    var errorMessage = "Can't concat horizontal because of each objects have different rows";
    var elements = this.toArray();
    var len = arguments.length;
    var all, i, argument;

    for (var r = 0, rows = this.rows; r < rows; ++r) {
      all = new Array(len);
      for (i = 0; i < len; ++i) {
        argument = arguments[i];

        if (typeof argument === 'number') {
          all[i] = argument;
        } else if (argument instanceof Array || argument instanceof Vector) {
          if (argument[r] === void 0) {
            throw new Error(errorMessage);
          }
          all[i] = argument[r];
        } else if (argument instanceof Matrix) {
          if (argument[r] === void 0) {
            throw new Error(errorMessage);
          }
          all[i] = argument[r].concat();
        }
      }
      var row = elements[r];
      elements[r] = row.concat.apply(row, all);
    }

    return Matrix.create(elements);
  }

  vcat() {
    var elements = this.toArray();
    var len = arguments.length;
    var index = elements.length;
    var errorMessage = "Can't concat vectical because of each objects have different cols";

    for (var i = 0; i < len; ++i) {
      var argument = arguments[i];
      if (typeof argument === 'number') {
        elements[index++] = Mx.Utils.generateFlatArray(this.cols, argument);
      } else if (argument instanceof Array) {
        if (this.cols !== argument.length) {
          throw new Error(errorMessage);
        }
        elements[index++] = argument;
      } else if (argument instanceof Vector) {
        if (this.cols !== argument.cols) {
          throw new Error(errorMessage);
        }
        elements[index++] = argument.flat();
      } else {
        if (this.cols !== argument.cols) {
          throw new Error(errorMessage);
        }
        var matArray = argument.toArray();
        for (var r = 0, rows = matArray.length; r < rows; ++r) {
          elements[index++] = matArray[r].concat();
        }
      }
    }

    return Matrix.create(elements);
  }

  setCol(index, col) {
    if (typeof col == 'number') {
      for (var r = this.rows - 1; r >= 0; --r) {
        this[r][index] = col;
      }
    } else {
      if (this.rows !== col.rows || this.cols <= index) {
        return undefined;
      }

      for (var r = this.rows - 1; r >= 0; --r) {
        this[r][index] = col[r];
      }
    }
    return this;
  }

  setRow(index, row) {
    if (typeof row == 'number') {
      for (var c = this.cols - 1; c >= 0; --c) {
        this[index][c] = row;
      }
    } else {
      if (this.cols != row.cols || this.rows <= index) {
        return undefined;
      }

      for (var c = this.cols - 1; c >= 0; --c) {
        this[index][c] = row[c];
      }
    }
    return this;
  }

  insertRow(index, row) {
    if (typeof row === 'number') {
      row = Mx.Utils.generateFlatArray(this.cols, row);
    } else if (row.dim) {
      row = row.toArray();
    }

    for (var i = this.rows++; i > index; --i) {
      this[i] = this[i - 1];
    }
    this[index] = row;
    return this;
  }

  insertCol(index, col) {
    var c, r;
    if (typeof col == 'number') {
      var tmp = new Array(this.rows);
      for (r = this.rows - 1; r >= 0; --r) {
        tmp[r] = col;
      }
      col = tmp;
    } else if (col.dim) {
      col = col.toArray();
    }

    for (r = 0, rlen = this.rows; r < rlen; ++r) {
      for (c = this.cols; c > index; --c) {
        this[r][c] = this[r][c - 1];
      }
    }
    for (r = 0, rlen = this.rows; r < rlen; ++r) {
      this[r][index] = col[c];
    }

    return this;
  }

  appendRow(row) {
    return this.insertRow(this.rows, row);
  }

  appendCol(col) {
    return this.insertCol(this.cols, col);
  }

  removeCol(col) {
    if (this.cols >= col) {
      for (var r = this.rows - 1; r >= 0; --r) {
        this[r].splice(col, 1);
      }
      this.cols--;
    }

    return this;
  }

  removeRow(row) {
    if (this.rows >= row) {
      for (var r = row, len = this.rows - 1; r < len; ++r) {
        this[r] = this[r + 1];
      }
      delete this[--this.rows];
    }

    return this;
  }
}


//   at: function(row, col) {
//     if (typeof col == 'undefined') {
//       col = row % this.cols;
//       row = row / this.cols;
//     }
//     return this[row][col];
//   },
//
//   row: function(row) {
//     return Vector.create(this[row].concat(), Vector.ROW);
//   },
//
//   col: function(col) {
//     var elements = new Array(this.rows);
//     for (var r = this.rows - 1; r >= 0; --r) {
//       elements[r] = this[r][col];
//     }
//     return Vector.create(elements, Vector.COL);
//   },
//
//   flat: function() {
//     var elements = new Array(this.rows * this.cols);
//     var index = 0, c;
//     for (var r = 0, rlen = this.rows; r < rlen; ++r) {
//       for (c = 0, clen = this.cols; c < clen; ++c) {
//         elements[index++] = this[r][c];
//       }
//     }
//     return elements;
//   },
//
//   t: function() {
//     var elements = new Array(this.cols);
//     var row, r;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       row = new Array(this.rows);
//       for (r = this.rows - 1; r >= 0; --r) {
//         row[r] = this[r][c];
//       }
//       elements[c] = row;
//     }
//
//     return Matrix.create(elements);
//   },
//
//   det: function() {
//     if (!this.isSquare() || this.isEmpty()) {
//       return undefined;
//     }
//
//     if (this.rows === 1) {
//       return this[0][0];
//     } else if (this.rows === 2) {
//       return this[0][0] * this[1][1] - this[0][1] * this[1][0];
//     } else if (this.rows === 3) {
//       return this[0][0] * this[1][1] * this[2][2] +
//         this[1][0] * this[2][1] * this[0][2] +
//         this[2][0] * this[0][1] * this[1][2] -
//         this[0][0] * this[2][1] * this[1][2] -
//         this[2][0] * this[1][1] * this[0][2] -
//         this[1][0] * this[0][1] * this[2][2];
//     } else {
//       var u = this.lu()[1];
//       var det = 1;
//       for (var i = this.rows - 1; i >= 0; --i) {
//         det *= u[i][i];
//       }
//       return det;
//     }
//   },
//
//   inv: function() {
//     if (!this.isSquare() || this.isEmpty()) {
//       return undefined;
//     }
//
//     var n   = this.rows;
//     var abs = Math.abs;
//     var src = this.clone();
//     var inv = Matrix.eye(src.rows);
//     var j, x, k, pivot, max, tmp;
//
//     for (var i = 0; i < n; ++i) {
//       if (src[i][i] !== 1) {
//         pivot = max = -1;
//         for (j = i; j !== n; ++j) {
//           k = abs(src[j][i]);
//           if (k > max) {
//             pivot = j;
//             max   = k;
//           }
//         }
//
//         if (i !== pivot) {
//           tmp = src[i]; src[i] = src[pivot]; src[pivot] = tmp;
//           tmp = inv[i]; inv[i] = inv[pivot]; inv[pivot] = tmp;
//         }
//
//         x = src[i][i];
//         for (j = 0; j < n; ++j) {
//           src[i][j] /= x;
//           inv[i][j] /= x;
//         }
//       }
//
//       for (j = 0; j < n; ++j) {
//         if (i != j) {
//           x = src[j][i];
//           for (k = 0; k < n; ++k) {
//             src[j][k] -= src[i][k] * x;
//             inv[j][k] -= inv[i][k] * x;
//           }
//         }
//       }
//     }
//
//     return inv;
//   },
//
//   add: function(v) {
//     var c;
//     if (typeof v == 'number') {
//       for (var r = this.rows - 1; r >= 0; --r) {
//         for (c = this.cols - 1; c >= 0; --c) {
//           this[r][c] += v;
//         }
//       }
//     } else {
//       for (var r = Math.min(this.rows, v.rows) - 1; r >= 0; --r) {
//         for (c = Math.min(this.cols, v.cols) - 1; c >= 0; --c) {
//           this[r][c] += v[r][c];
//         }
//       }
//     }
//     return this;
//   },
//
//   sub: function(v) {
//     var c;
//     if (typeof v == 'number') {
//       for (var r = this.rows - 1; r >= 0; --r) {
//         for (c = this.cols - 1; c >= 0; --c) {
//           this[r][c] -= v;
//         }
//       }
//     } else {
//       for (var r = Math.min(this.rows, v.rows) - 1; r >= 0; --r) {
//         for (c = Math.min(this.cols, v.cols) - 1; c >= 0; --c) {
//           this[r][c] -= v[r][c];
//         }
//       }
//     }
//     return this;
//   },
//
//   mul: function(v) {
//     var c;
//     if (typeof v == 'number') {
//       for (var r = this.rows - 1; r >= 0; --r) {
//         for (c = this.cols - 1; c >= 0; --c) {
//           this[r][c] *= v;
//         }
//       }
//     } else {
//       for (var r = Math.min(this.rows, v.rows) - 1; r >= 0; --r) {
//         for (c = Math.min(this.cols, v.cols) - 1; c >= 0; --c) {
//           this[r][c] *= v[r][c];
//         }
//       }
//     }
//     return this;
//   },
//
//   mmul: function(v) {
//     if (typeof v === 'number') {
//       v = Matrix.create([ v ]);
//     } else if (v instanceof Vector) {
//       v = v.toMat();
//     }
//
//     if (this.cols !== v.rows) {
//       throw new Error('cols of the left matrix and rows of the right matrix is not equal');
//     }
//
//     var elements = new Array(this.rows);
//     var row, c, sum, i0, i1, i2;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       row = new Array(v.cols);
//       for (c = v.cols - 1; c >= 0; --c) {
//         sum = 0;
//         for (i0 = this.cols - 1; i0 >= 2; i0 -= 3) {
//           i1 = i0 - 1;
//           i2 = i0 - 2;
//           sum += (this[r][i0] * v[i0][c]) +
//             (this[r][i1] * v[i1][c]) +
//             (this[r][i2] * v[i2][c]);
//         }
//         if (i0 === 1) {
//           sum += (this[r][1] * v[1][c])  +
//             (this[r][0] * v[0][c]);
//         }
//         if (i0 === 0) {
//           sum += this[r][0] * v[0][c];
//         }
//         row[c] = sum;
//       }
//       elements[r] = row;
//     }
//     return Matrix.create(elements);
//   },
//
//   div: function(v) {
//     var c;
//     if (typeof v == 'number') {
//       for (var r = this.rows - 1; r >= 0; --r) {
//         for (c = this.cols - 1; c >= 0; --c) {
//           this[r][c] /= v;
//         }
//       }
//     } else {
//       for (var r = Math.min(this.rows, v.rows) - 1; r >= 0; --r) {
//         for (c = Math.min(this.cols, v.cols) - 1; c >= 0; --c) {
//           this[r][c] /= v[r][c];
//         }
//       }
//     }
//     return this;
//   },
//
//   pow: function(p) {
//     if (p == 1) {
//       return this;
//     }
//
//     var f = Mx.Utils.getPow(p), c;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       for (c = this.cols - 1; c >= 0; --c) {
//         this[r][c] = f(this[r][c]);
//       }
//     }
//
//     return this;
//   },
//
//   min: function() {
//     return Math.min.apply(null, this.flat());
//   },
//
//   minWithIndex: function() {
//     var elements = this.flat();
//     var min = Math.min.apply(null, elements);
//     var index = elements.indexOf(min);
//     return [ min, index ];
//   },
//
//   minRows: function() {
//     var mins = new Array(this.rows);
//     for (var r = this.rows - 1; r >= 0; --r) {
//       mins[r] = Math.min.apply(null, this[r]);
//     }
//     return Vector.create(mins, Vector.COL);
//   },
//
//   minRowsWithIndex: function() {
//     var mins = new Array(this.rows);
//     var indices = new Array(this.rows);
//     var min;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       min = Math.min.apply(null, this[r]);
//       mins[r] = min;
//       indices[r] = this[r].indexOf(min);
//     }
//     return [
//       Vector.create(mins, Vector.COL),
//       Vector.create(indices, Vector.COL)
//     ]
//   },
//
//   minCols: function() {
//     var mins = new Array(this.cols);
//     var elements, r;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       elements = new Array(this.rows);
//       for (r = this.rows - 1; r >= 0; --r) {
//         elements[r] = this[r][c];
//       }
//       mins[c] = Math.min.apply(null, elements);
//     }
//     return Vector.create(mins, Vector.ROW);
//   },
//
//   minColsWithIndex: function() {
//     var mins = new Array(this.cols);
//     var indices = new Array(this.cols);
//     var elements, r, min;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       elements = new Array(this.rows);
//       for (r = this.rows - 1; r >= 0; --r) {
//         elements[r] = this[r][c];
//       }
//       min = Math.min.apply(null, elements);
//       mins[c] = min;
//       indices[c] = elements.indexOf(min);
//     }
//     return [
//       Vector.create(mins, Vector.ROW),
//       Vector.create(indices, Vector.ROW)
//     ]
//   },
//
//   max: function() {
//     return Math.max.apply(null, this.flat());
//   },
//
//   maxWithIndex: function() {
//     var elements = this.flat();
//     var max = Math.max.apply(null, elements);
//     var index = elements.indexOf(max);
//     return [ max, index ];
//   },
//
//   maxRows: function() {
//     var maxes = new Array(this.rows);
//     for (var r = this.rows - 1; r >= 0; --r) {
//       maxes[r] = Math.max.apply(null, this[r]);
//     }
//     return Vector.create(maxes, Vector.COL);
//   },
//
//   maxRowsWithIndex: function() {
//     var maxes = new Array(this.rows);
//     var indices = new Array(this.rows);
//     var max;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       max = Math.max.apply(null, this[r]);
//       maxes[r] = max;
//       indices[r] = this[r].indexOf(max);
//     }
//     return [
//       Vector.create(maxes, Vector.COL),
//       Vector.create(indices, Vector.COL)
//     ]
//   },
//
//   maxCols: function() {
//     var maxes = new Array(this.cols);
//     var elements, r;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       elements = new Array(this.rows);
//       for (r = this.rows - 1; r >= 0; --r) {
//         elements[r] = this[r][c];
//       }
//       maxes[c] = Math.max.apply(null, elements);
//     }
//     return Vector.create(maxes, Vector.ROW);
//   },
//
//   maxColsWithIndex: function() {
//     var maxes = new Array(this.cols);
//     var indices = new Array(this.cols);
//     var elements, r, max;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       elements = new Array(this.rows);
//       for (r = this.rows - 1; r >= 0; --r) {
//         elements[r] = this[r][c];
//       }
//       max = Math.max.apply(null, elements);
//       maxes[c] = max;
//       indices[c] = elements.indexOf(max);
//     }
//     return [
//       Vector.create(maxes, Vector.ROW),
//       Vector.create(indices, Vector.ROW)
//     ]
//   },
//
//   sum: function() {
//     var sum = 0, c;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       for (c = this.cols - 1; c >= 0; --c) {
//         sum += this[r][c];
//       }
//     }
//     return sum;
//   },
//
//   sumCols: function(col) {
//     if (col !== void 0) {
//       var sum = 0;
//       for (r = this.rows - 1; r >= 0; --r) {
//         sum += this[r][col];
//       }
//       return sum;
//     } else {
//       var sum = new Array(this.cols), r;
//       for (var c = this.cols - 1; c >= 0; --c) {
//         sum[c] = 0;
//         for (r = this.rows - 1; r >= 0; --r) {
//           sum[c] += this[r][c];
//         }
//       }
//       return Vector.create(sum, Vector.ROW);
//     }
//   },
//
//   sumRows: function(row) {
//     if (row !== void 0) {
//       var sum = 0;
//       for (var c = this.cols - 1; c >= 0; --c) {
//         sum += this[row][c];
//       }
//       return sum;
//     } else {
//       var sum = new Array(this.rows), c;
//       for (var r = this.rows - 1; r >= 0; --r) {
//         sum[r] = 0;
//         for (c = this.cols - 1; c >= 0; --c) {
//           sum[r] += this[r][c];
//         }
//       }
//       return Vector.create(sum, Vector.COL);
//     }
//   },
//
//   flipRows: function() {
//     if (this.cols === 1) {
//       return this;
//     }
//
//     for (var r = this.rows - 1; r >= 0; --r) {
//       this[r].reverse();
//     }
//     return this;
//   },
//
//   flipCols: function() {
//     if (this.rows === 1) {
//       return this;
//     }
//
//     var cols = new Array(this.cols);
//     var rows = this.rows;
//     var rowm = rows - 1;
//     var r, tmp
//     for (var c = this.cols - 1; c >= 0; --c) {
//       for (r = rowm, len = Math.floor(rows / 2); r >= len; --r) {
//         tmp = this[r][c];
//         this[r][c] = this[rowm - r][c];
//         this[rowm - r][c] = tmp;
//       }
//     }
//     return this;
//   },
//
//   meanCols: function() {
//     var mean = new Array(this.cols), r;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       mean[c] = 0;
//       for (r = this.rows - 1; r >= 0; --r) {
//         mean[c] += this[r][c];
//       }
//       mean[c] /= this.rows;
//     }
//     return Vector.create(mean, Vector.ROW);
//   },
//
//   meanRows: function() {
//     var mean = new Array(this.rows), c;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       mean[r] = 0;
//       for (c = this.cols - 1; c >= 0; --c) {
//         mean[r] += this[r][c];
//       }
//       mean[r] /= this.cols;
//     }
//     return Vector.create(mean, Vector.COL);
//   },
//
//   stdCols: function() {
//     var mean = this.meanCols();
//     var std = new Array(this.cols), r, tmp, sum;
//     for (var c = this.cols - 1; c >= 0; --c) {
//       sum = 0;
//       for (r = this.rows - 1; r >= 0; --r) {
//         tmp = this[r][c] - mean[c];
//         sum += tmp * tmp;
//       }
//       std[c] = Math.sqrt(sum / this.rows);
//     }
//     return Vector.create(std, Vector.ROW);
//   },
//
//   stdRows: function() {
//     var mean = this.meanRows();
//     var std = new Array(this.rows), c, tmp, sum;
//     for (var r = this.rows - 1; r >= 0; --r) {
//       sum = 0;
//       for (c = this.cols - 1; c >= 0; --c) {
//         tmp = this[r][c] - mean[c];
//         sum += tmp * tmp;
//       }
//       std[r] = Math.sqrt(sum / this.cols);
//     }
//     return Vector.create(std, Vector.COL);
//   },
//
//   lu: function() {
//     if (!this.isSquare()) {
//       return undefined;
//     }
//
//     var m = this.clone();
//     var l = Matrix.eye(this.rows);
//     var u = Matrix.zeros(this.rows);
//     var sum, i, j, k, rlen, clen;
//     for (i = 0, clen = this.cols; i < clen; ++i) {
//       for (j = i + 1, rlen = this.rows; j < rlen; ++j) {
//         m[j][i] /= m[i][i];
//         for (k = i + 1; k < rlen; ++k) {
//           m[j][k] -= m[j][i] * m[i][k];
//         }
//       }
//       // for (i = 0; i <= j; ++i) {
//       //   for (k = 0, sum = 0; k <= i - 1; ++k) {
//       //     sum += l[i][k] * u[k][j];
//       //   }
//       //   u[i][j] = this[i][j] - sum;
//       // }
//       //
//       // for (i = j + 1; i < this.rows; ++i) {
//       //   for (k = 0, sum = 0; k <= j - 1; ++k) {
//       //     sum += l[i][k] * u[k][j];
//       //   }
//       //   l[i][j] = (this[i][j] - sum) / u[j][j];
//       // }
//     }
//
//     for (i = 0, clen = this.rows; i < clen; ++i) {
//       for (j = 0, rlen = this.cols; j < clen; ++j) {
//         if (i > j) {
//           l[i][j] = m[i][j];
//         } else {
//           u[i][j] = m[i][j];
//         }
//       }
//     }
//
//     return [ l, u ];
//   }
// };
// Matrix.fn = Matrix.prototype;
//
// asMath.call(Matrix.fn);
