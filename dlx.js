/*
 * Implements Knuth's dancing links algorithm as shown here:
 * https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf
 */

// Represents a 1 in the DLX matrix.
var DataObject = function(rowName, column) {
  this.left = null;
  this.right = null;
  this.up = null;
  this.down = null;
  this.rowName = rowName;
  this.column = column;
}

// Represents column object (header of each column).
var ColumnObject = function(columnName) {
  this.columnName = columnName;
  this.size = 0;
  this.left = null;
  this.right = null;
  this.up = null;
  this.down = null;
  this.column = this;
}

// Matrix is mxn 2d 0-1 array, rowNames is length m, colNames is length n.
var DLXTable = function(matrix, rowNames, colNames) {
  this.dataArray = [];
  this.root = new ColumnObject("ROOT");
  var prev = this.root;
  for (var c = 0; c < colNames.length; c++) {
    var column = new ColumnObject(colNames[c]);
    column.left = prev;
    prev.right = column;
    if (c === colNames.length - 1) {
      column.right = this.root;
      this.root.left = column;
    }
    column.up = column;
    column.down = column;
    prev = column;
  }

  for (var r = 0; r < rowNames.length; r++) {
    var column = this.root.right;
    var leftmostNode = null;
    var rightmostNode = null;
    for (var c = 0; c < colNames.length; c++) {
      if (matrix[r][c] === 1) {
        var node = new DataObject(rowNames[r], column);
        if (leftmostNode === null) {
          leftmostNode = node;
        }
        node.left = rightmostNode;
        if (rightmostNode) {
          rightmostNode.right = node;
        }
        rightmostNode = node;

        node.up = column.up;
        column.up.down = node;
        column.up = node;
        node.down = column;
        column.size++;
        this.dataArray.push(node);
      }

      column = column.right;
    }
    if (leftmostNode && rightmostNode) {
      rightmostNode.right = leftmostNode;
      leftmostNode.left = rightmostNode;
    }
  }
}

// For debugging.
DLXTable.prototype.printInfo = function() {
  console.log("ROOT");
  console.log("ROOT.left = " + this.root.left.columnName);
  console.log("ROOT.right = " + this.root.right.columnName);
  for (var c8 = this.root.right; c8 != this.root; c8 = c8.right) {
    console.log("Column with name " + c8.columnName);
    console.log("Size: " + c8.size);
    console.log("Left: " + c8.left.columnName);
    console.log("Right: " + c8.right.columnName);
    var downNames = "";
    for (var r8 = c8.down; r8 != c8; r8 = r8.down) {
      downNames += (r8.rowName + " ");
    }
    var upNames = "";
    for (var r8 = c8.up; r8 != c8; r8 = r8.up) {
      upNames += (r8.rowName + " ");
    }
    console.log("Rows going down: " + downNames);
    console.log("Rows going up: " + upNames);
    console.log();
  }

  this.dataArray.forEach(function(item) {
    console.log("(" + item.rowName + ", " + item.column.columnName + ")");
  });
}

// Returns an array of names of rows that form an exact cover. If no such cover
// is possible, returns 0;
DLXTable.prototype.search = function() {
  var results = [];
  this.searchRec([], results);
  return results;
}

// Loads chosen names of chosen rows into results.
DLXTable.prototype.searchRec = function(objArray, results) {
  if (this.root.right === this.root) {
    objArray.forEach(function(obj) {
      results.push(obj.rowName);
    });
    return;
  }
  var column = this.chooseColumn();
  this.cover(column);
  for (var r = column.down; r != column; r = r.down) {
    objArray.push(r);
    for (var j = r.right; j != r; j = j.right) {
      this.cover(j.column);
    }
    this.searchRec(objArray, results);
    r = objArray.pop();
    column = r.column;
    for (var j = r.left; j != r; j = j.left) {
      this.uncover(j.column);
    }
  }
  this.uncover(column);
}

// Covers a column.
DLXTable.prototype.cover = function(column) {
  column.right.left = column.left;
  column.left.right = column.right;
  for (var i = column.down; i != column; i = i.down) {
    for (var j = i.right; j != i; j = j.right) {
      j.down.up = j.up;
      j.up.down = j.down;
      j.column.size--;
    }
  }
}

// Uncovers a column.
DLXTable.prototype.uncover = function(column) {
  for (var i = column.up; i != column; i = i.up) {
    for (var j = i.left; j != i; j = j.left) {
      j.column.size++;
      j.down.up = j;
      j.up.down = j;
    }
  }
  column.right.left = column;
  column.left.right = column;
}

// Returns the column object with the smallest size.
DLXTable.prototype.chooseColumn = function() {
  var chosenColumn = this.root.right;
  for (var column = this.root.right; column != this.root; column = column.right) {
    if (column.size < chosenColumn.size) {
      chosenColumn = column;
    }
  }
  return chosenColumn;
}

function testWithKnuthExample() {
  var test = new DLXTable([
    [0, 0, 1, 0, 1, 1, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 1]
  ], ["I", "II", "III", "IV", "V", "VI"], ["A", "B", "C", "D", "E", "F", "G"]);
  var testResults = test.search();
  console.log(testResults); // should have ['IV', 'I', 'V']
}
testWithKnuthExample();
