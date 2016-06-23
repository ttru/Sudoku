function createSquare() {
  var square = document.createElement("div");
  square.className = "sudoku-square";

  var squareContent = document.createElement("div");
  squareContent.className = "sudoku-square-content";
  square.appendChild(squareContent);

  var squareTable = document.createElement("div");
  squareTable.className = "sudoku-square-table";
  squareContent.appendChild(squareTable);

  var squareTableCell = document.createElement("div");
  squareTableCell.className = "sudoku-square-table-cell";
  squareTable.appendChild(squareTableCell);

  return square;
}

function createSquare2() {
  var square = document.createElement("div");
  square.className = "s-square";

  var squareContent = document.createElement("div");
  squareContent.className = "s-square-content";
  square.appendChild(squareContent);

  var squareTable = document.createElement("div");
  squareTable.className = "s-square-table";
  squareContent.appendChild(squareTable);

  var squareTableCell = document.createElement("div");
  squareTableCell.className = "s-square-table-cell";
  squareTable.appendChild(squareTableCell);

  var cellValue = document.createElement("div");
  cellValue.className = "s-cell-value";
  squareTableCell.appendChild(cellValue);

  return square;
}

function createGrid() {
  for (var i = 0; i < 9; i++) {
    var group = createSquare();
    for (var j = 0; j < 9; j++) {
      $(group).children(".sudoku-square-content")
              .children(".sudoku-square-table")
              .children(".sudoku-square-table-cell")
              .append(createSquare());
    }
    $("#sudoku-grid").append(group);
  }
}

// TODO: clean up, get rid of code from previous approach
function createGrid2() {
  for (var i = 0; i < 81; i++) {
    var square = createSquare2();
    $(square).find(".s-cell-value").html("" + i);
    $(square).css("border", "1px solid black");
    if (Math.floor(i / 9) === 0) {
      $(square).css("border-top", "4px solid black");
    }
    if (Math.floor(i / 9) === 8) {
      $(square).css("border-bottom", "4px solid black");
    }
    if (i % 9 < 1) {
      $(square).css("border-left", "4px solid black");
    }
    if (i % 9 >= 8) {
      $(square).css("border-right", "4px solid black");
    }
    if (i % 3 === 0 && i % 9 !== 0) {
      $(square).css("border-left", "2px solid black");
    }
    if (i % 3 === 2 && i % 9 !== 8) {
      $(square).css("border-right", "2px solid black");
    }
    if (Math.floor(i / 9) === 3 || Math.floor(i / 9) === 6) {
      $(square).css("border-top", "2px solid black");
    }
    if (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5) {
      $(square).css("border-bottom", "2px solid black");
    }
    $("#sudoku-grid").append(square);
  }
}

$(document).ready(function() {
  createGrid2();
});
