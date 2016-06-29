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

  var input = $("<input></input>");
  input.addClass("text-center");
  input.addClass("sudoku-input");
  input.attr("pattern", "[0-9]*");
  input.attr("inputmode", "numeric");
  input.focus(function() {
    input.val("");
  });
  input.keydown(function(event) {
    if (!(event.which > 48 && event.which < 58)) {
      /* Disallow any values in input outside of 1-9. */
      event.preventDefault();
    } else {
      /* Allow only one digit in input. */
      input.val("");
    }
  });

  cellValue.append(input);

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
