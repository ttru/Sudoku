function createSquare() {
  var square = $("<div></div>");
  square.addClass("sudoku-square");

  var squareContent = $("<div></div>");
  squareContent.addClass("sudoku-square-content");
  square.append(squareContent);

  var squareTable = $("<div></div>");
  squareTable.addClass("sudoku-square-table");
  squareContent.append(squareTable);

  var squareTableCell = $("<div></div>");
  squareTableCell.addClass("sudoku-square-table-cell");
  squareTable.append(squareTableCell);

  var cellValue = $("<div></div>");
  cellValue.addClass("sudoku-cell-value");
  squareTableCell.append(cellValue);

  square.click(function() {
    var currentValue = square.find(".sudoku-cell-value").html();
    if (currentValue === "") {
      square.find(".sudoku-cell-value").html("1");
    } else if (currentValue === "9") {
      square.find(".sudoku-cell-value").html("");
    } else {
      square.find(".sudoku-cell-value").html("" + (Number(currentValue) + 1));
    }
  });

  return square;
}

function createGrid() {
  for (var i = 0; i < 81; i++) {
    var square = createSquare();
    square.css("border", "1px solid black");
    // Thicken borders for cells at edges.
    if (Math.floor(i / 9) === 0) {
      square.css("border-top", "4px solid black");
    }
    if (Math.floor(i / 9) === 8) {
      square.css("border-bottom", "4px solid black");
    }
    if (i % 9 < 1) {
      square.css("border-left", "4px solid black");
    }
    if (i % 9 >= 8) {
      square.css("border-right", "4px solid black");
    }
    if (i % 3 === 0 && i % 9 !== 0) {
      square.css("border-left", "2px solid black");
    }
    if (i % 3 === 2 && i % 9 !== 8) {
      square.css("border-right", "2px solid black");
    }
    if (Math.floor(i / 9) === 3 || Math.floor(i / 9) === 6) {
      square.css("border-top", "2px solid black");
    }
    if (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5) {
      square.css("border-bottom", "2px solid black");
    }
    $("#sudoku-grid").append(square);
  }
}

$(document).ready(function() {
  createGrid();
});
