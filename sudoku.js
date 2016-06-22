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

$(document).ready(function() {
  createGrid();
});
