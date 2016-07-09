/*
 * Uses exact cover formulation of sudoku problem from here:
 * https://en.wikipedia.org/wiki/Exact_cover#Finding_solutions
 */

// Given a 0-based index in the sudoku grid, returns the row number (1-based).
var getRowNumOfIndex = function(index) {
  return Math.floor(index / 9) + 1;
};

// Given a 0-based index in the sudoku grid, returns the col number (1-based).
var getColNumOfIndex = function(index) {
  return (index % 9) + 1;
};

// Given a 1-based row and column number, returns an index number from 0 to 80.
var getIndexFromRowAndCol = function(row, col) {
  return (row - 1) * 9 + (col - 1);
};

// Given a 1-based row and column number, returns the box number (1-based).
var getBoxNumber = function(row, col) {
  return 3 * Math.floor((row - 1) / 3) + Math.floor((col - 1) / 3) + 1;
};

// Returns an object containing row, column, and number information from a
// row name (e.g. "R1C1#1" returns {"row": 1, "col": 1, "box": 1, "val":1}).
var getInfoObject = function(name) {
  var r = parseInt(name[1]);
  var c = parseInt(name[3]);
  return {
    "row": r,
    "col": c,
    "box": getBoxNumber(r, c),
    "val": parseInt(name[5])
  };
};

// Returns the name from a 0-based index and a value (e.g. "R1C1#1" returned
// for index = 0 and value = 1.
var getNameFromIndexAndVal = function(index, val) {
  return "R" + getRowNumOfIndex(index) + "C" + getColNumOfIndex(index) +
         "#" + val;
};

// Given an object containing row, column, box, and value information,
// returns an array of constraint (column) names that it "hits".
var getConstraintsList = function(infoObj) {
  return [
    "R" + infoObj.row + "C" + infoObj.col,
    "R" + infoObj.row + "#" + infoObj.val,
    "C" + infoObj.col + "#" + infoObj.val,
    "B" + infoObj.box + "#" + infoObj.val
  ];
};

// Returns the index of the given constraint.
var getConstraintIndex = function(constraint) {
  var con1 = constraint[0];
  var val1 = parseInt(constraint[1]);
  var con2 = constraint[2];
  var val2 = parseInt(constraint[3]);
  if (con1 === "R" && con2 === "C") {
    return 9*(val1 - 1) + (val2 - 1);
  } else if (con1 === "R" && con2 === "#") {
    return 81 + 9*(val1 - 1) + (val2 - 1);
  } else if (con1 === "C" && con2 === "#") {
    return 162 + 9*(val1 - 1) + (val2 - 1);
  } else {
    return 243 + 9*(val1 - 1) + (val2 - 1);
  }
};

// Takes in 81-character string representing sudoku puzzle.
// Blanks are represented with spaces.
// Order is row-major, left to right, top to bottom.
// Returns an 81-character solved puzzle or null if no solution.
var solveFromString = function(sudokuString) {
  var matrix = [];
  var colNames = [];
  // Row-Col constraints
  for (var r = 1; r <= 9; r++) {
    for (var c = 1; c <= 9; c++) {
      colNames.push("R" + r + "C" + c);
    }
  }
  // Row-Num constraints
  for (var r = 1; r <= 9; r++) {
    for (var n = 1; n <= 9; n++) {
      colNames.push("R" + r + "#" + n);
    }
  }
  // Col-Num constraints
  for (var c = 1; c <= 9; c++) {
    for (var n = 1; n <= 9; n++) {
      colNames.push("C" + c + "#" + n);
    }
  }
  // Box-Num constraints
  for (var b = 1; b <= 9; b++) {
    for (var n = 1; n <= 9; n++) {
      colNames.push("B" + b + "#" + n);
    }
  }

  var rowNames = [];
  for (var r = 1; r <= 9; r++) {
    for (var c = 1; c <= 9; c++) {
      for (var n = 1; n <= 9; n++) {
        var row = new Array(324).fill(0);
        matrix.push(row);
        var name = "R" + r + "C" + c + "#" + n;
        rowNames.push(name);
        var infoObj = getInfoObject(name);
        var constraints = getConstraintsList(infoObj);
        constraints.forEach(function(constraint) {
          row[getConstraintIndex(constraint)] = 1;
        });
      }
    }
  }


  var existingConstraintSet = new Set();
  for (var i = 0; i < 81; i++) {
    var val = sudokuString[i];
    if (val !== " ") {
      var name = getNameFromIndexAndVal(i, parseInt(val));
      var infoObj = getInfoObject(name);
      var constraints = getConstraintsList(infoObj);
      for (var j = 0; j < constraints.length; j++) {
        if (existingConstraintSet.has(constraints[j])) {
          // Constraint was hit by two numbers in puzzle, unsolvable.
          console.log(constraints[j]);
          return null;
        } else {
          existingConstraintSet.add(constraints[j]);
        }
      }
    }
  }

  var dlx = new DLXTable(matrix, rowNames, colNames);


  existingConstraintSet.forEach(function(constraint) {
    dlx.coverByName(constraint);
  });

  var resultRows = dlx.search();
  resultRows.sort();
  var solvedString = sudokuString.split("");
  resultRows.forEach(function(rowName) {
    var objInfo = getInfoObject(rowName);
    var index = getIndexFromRowAndCol(objInfo.row, objInfo.col);
    solvedString[index] = String(objInfo.val);
  });
  return solvedString.join("");
};
