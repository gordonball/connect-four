"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let winner = false; // set variable for if winner
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");
  // TODO: creates first row and adds event listener for player move
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // TODO: creates columns equal to length of WIDTH, gives each column id of x (0 - 6)
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // TODO: Create a table row element and assign to a "row" variable
    const row = document.createElement("tr");
    // row.setAttribute("id", y);
    for (let x = 0; x < WIDTH; x++) {
      // TODO: Create a table cell element and assign to a "cell" variable
      const cell = document.createElement("td");
      // TODO: add an id, y-x, to the above table cell element
      cell.setAttribute("id", `${y}-${x}`);
      // you'll use this later, so make sure you use y-x
      // TODO: append the table cell to the table row
      row.appendChild(cell);
    }
    // TODO: append the row to the html board
    htmlBoard.appendChild(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 5
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement("div");
  piece.classList.add("player");
  piece.classList.add(`player${currPlayer}`);
  console.log({ piece });
  document.getElementById(`${y}-${x}`).append(piece);


}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => alert(msg), 50);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (winner) return

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()) {
    return endGame("Tie");
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  // switch players
  // TODO: move code into handleClick or make function
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
}

/** check for tie, look for all non-nulls, return true if tie */
function checkForTie() {
  return board.every((row) => row.every((cell) => cell !== null));
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {
    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    for (let i = 0; i < cells.length; i++) {
      const [y, x] = cells[i];
      if (!(y in board) || !(x in board[y])) return false;
      if (board[y][x] !== currPlayer) return false;

    }
    winner = true;
    return true;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];

      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]];

      const diagDL = [
        [y, x],
        [y - 1, x - 1],
        [y - 2, x - 2],
        [y - 3, x - 3]];

      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {

        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
