import { TETROMINOS } from "./Pieces.js";
import { nextPieceCells } from "./main.js";

console.log("this is where the board goes");
console.log(TETROMINOS);
// Game state
export const game = {
  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
  activePiece: null,
  nextPiece: null,
  score: 0,
  timer: {
    startTime: null,
    elapsed: 0, // milliseconds
    isRunning: false,
    intervalId: null
  }
};

export function getGameState() {
  return game;
}

export function shouldSpawnNewPieceAndShiftPieceDown() {
  let shouldSpawnNewPiece = shiftPieceDown();
  if (shouldSpawnNewPiece === -1) {
    spawnPiece(getNextPiece());
    renderNextPiece(nextPieceCells);
  }

  return shouldSpawnNewPiece;
}

// Create a new active piece
export function spawnPiece(tetrominoKey) {
  const tetromino = TETROMINOS[tetrominoKey]; // 'T'
  game.activePiece = {
    shape: tetromino["shapes"],
    rot: 0,
    row: 0,
    col: 3,
    id: tetromino["id"],
  };

  if (game.activePiece != null) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        // Inner loop for columns
        if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
          game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
        }
      }
    }
  }
}

// Generate a random tetromino key
export function getRandomPieceKey() {
  const pieces = ["T", "L", "O", "I", "S", "Z", "J"];
  const randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}

// Set the next piece
export function setNextPiece() {
  game.nextPiece = getRandomPieceKey();
}

// Get the current next piece and generate a new one
export function getNextPiece() {
  const piece = game.nextPiece;
  setNextPiece();
  return piece;
}

// Render the next piece in the preview box
export function renderNextPiece(nextPieceCells) {
  if (!game.nextPiece) return;

  const tetromino = TETROMINOS[game.nextPiece];
  const shape = tetromino.shapes[0]; // Show first rotation

  // Clear all cells
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      nextPieceCells[r][c].style.backgroundColor = "transparent";
    }
  }

  // Render the piece
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] === 1) {
        nextPieceCells[r][c].style.backgroundColor = "var(--filled)";
      }
    }
  }
}

// Change the active piece to the next rotation
export function rotatePiece() {
  if (!game.activePiece) return;

  // Erase current piece from the board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 0;
      }
    }
  }

  const { row, col, shape } = game.activePiece;
  const nextRot = (game.activePiece.rot + 1) % shape.length;

  // Try shifts to try to rotate
  const shifts = [0, -1, -2];

  let appliedShift = null;
  for (const shift of shifts) {
    if (canPlace(shape[nextRot], row + shift, col)) {
      game.activePiece.rot = nextRot;
      game.activePiece.row = row + shift;
      appliedShift = shift;
      break;
    }
  }

  // If rotation couldn't be applied, redraw original orientation and bail
  if (appliedShift === null) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (shape[game.activePiece.rot][i][j] === 1) {
          game.board[row + i][col + j] = 1;
        }
      }
    }
    return; // no rotation
  }

  // Draw rotated piece
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[game.activePiece.rot][i][j] === 1) {
        game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;
      }
    }
  }
}

// Return true if a 4x4 shape can be placed at (row,col) fully in-bounds
// and not overlapping any solidified cells (marked as 2).
function canPlace(shape, row, col) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[i][j] !== 1) continue;

      const y = row + i;
      const x = col + j;

      // bounds
      if (y < 0 || y >= 20 || x < 0 || x >= 10) return false;
      // collision with solidified cells
      if (game.board[y][x] !== 0) return false;
    }
  }
  return true;
}

// Shift piece down
export function shiftPieceDown() {
  if (!game.activePiece) return;

  // Erase the active piece off the board (still exists in the activePiece var)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
        game.board[game.activePiece.row + i][game.activePiece.col + j] = 0;
    }
  }

  // If we should solidify, set the active piece to null
  if (solidifyPiece()) {
    // Put the new piece on the board where it currently is
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
          game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;
      }
    }
    game.activePiece = null;

    // Update the score
    updateScore();

    return -1;
  }

  // Move the piece down if we shouldn't solidify
  // Increment the row to move the active piece down
  game.activePiece.row += 1;

  // Put the new piece on the board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
        game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;
    }
  }
  return 1;
}

// Checks for complete rows and adds to the score
// returns the score to add to the main score
export function updateScore() {
  let completeRows = 0;

  // iterate through 2d array board and check for complete rows //
  for (let i = 0; i < 20; i++) {
    let isRowComplete = true;
    for (let j = 0; j < 10; j++) {
      // If the board is 0 at any point, row is incomplete.
      if (game.board[i][j] === 0) {
        isRowComplete = false;
        break;
      }
    }
    // after iterating through a row check to see if isRowComplete is true
    if (isRowComplete) {
      completeRows++;
      // add to score based on the number of complete rows
      // 1 row = 100pts
      // 2 rows = 200pts
      // 3 rows = 300pts
      // 4 rows = 400pts
      game.score += completeRows * 100;
      updateScoreUI();

      // Remove this row and add a new empty row at the top
      removeCompleteRow(i);
      i--;
    }
  }
}

// clear complete lines
// add new row to the top
export function removeCompleteRow(rowIndex) {
  // set all of the values of the complete row back to 0
  game.board.splice(rowIndex, 1);
  game.board.unshift(Array(10).fill(0));
}
function updateScoreUI() {
  // scoreElement is the p tag inside the score-box
  const scoreElement = document.getElementById("score-box")?.querySelector("p");
  scoreElement.textContent = game.score;
}

// Checks if we should solidify piece, returns boolean
export function solidifyPiece() {
  const nextRow = game.activePiece.row + 1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] !== 1) continue;

      const y = nextRow + i;
      const x = game.activePiece.col + j;

      // bounds first
      if (y >= 20 || x < 0 || x >= 10) return true;

      // collision with settled blocks (with your current single-layer board)
      if (game.board[y][x] === 1) return true;
    }
  }
  return false; // safe to move down
}

export function printBoard() {
  for (let i = 0; i < 20; i++) {
    console.log(game.board[i].toString());
  }
  console.log(game.board[2].toString());
}

export function shiftPieceLeft() {
  const shape = game.activePiece.shape[game.activePiece.rot];
  let firstOccupiedColumn = 3; // Default to max possible

  // Scan 4x4 shape to find smallest column index of 1 (lets pieces with empty left columns shift to col 0)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (shape[row][col] === 1) {
        if (col < firstOccupiedColumn) {
          firstOccupiedColumn = col;
        }
      }
    }
  }

  // Boundary: don't go past left edge
  if (game.activePiece.col + firstOccupiedColumn <= 0) return;

  // Collision: don't move left into another piece (uses left-edge cells)
  let leftCells = getLeftCells(shape);
  if (isAgainstPieceLeft(leftCells)) return;

  // Erase the current piece off the board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 0;
      }
    }
  }

  game.activePiece.col -= 1; // move left

  // Redraw the piece
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
      }
    }
  }
}

// Shift piece left merge helpers

// get left pieces
function getLeftCells(piece) {
  const cells = [];

  for (let r = 0; r < piece.length; r++) {
    const row = piece[r];
    const c = row.indexOf(1); // first 1 in this row
    if (c !== -1) cells.push({ r, c });
  }

  return cells;
}

function isAgainstPieceLeft(leftCells) {
  // find true board location for each piece and check if there is a 1 next to it
  let isAgainstPieceLeft = false;
  leftCells.forEach((cell) => {
    let boardRow = game.activePiece.row + cell.r;
    let boardColumn = game.activePiece.col + cell.c;
    if (game.board[boardRow][boardColumn - 1] === 1) {
      isAgainstPieceLeft = true;
    }
  });
  return isAgainstPieceLeft;
}

export function shiftPieceRight() {
  //   let pieceLength = 0;
  const lenghts = game.activePiece.shape[game.activePiece.rot].map(
    (row) => row.filter((num) => num === 1).length,
  );
  let pieceLength = Math.max(...lenghts);

  let rightCells = getRightCells(game.activePiece.shape[game.activePiece.rot]);
  // Check only right edge
  if (
    game.activePiece.col + pieceLength - 1 >= 9 ||
    isAgainstPieceRight(rightCells)
  )
    return;

  // Erase the current piece off the board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 0;
      }
    }
  }

  game.activePiece.col += 1; // move right

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
      }
    }
  }
}

export function startTimer() {
  if (game.timer.isRunning) return;
  
  game.timer.isRunning = true;
  game.timer.startTime = Date.now() - game.timer.elapsed;
  
  game.timer.intervalId = setInterval(() => {
    game.timer.elapsed = Date.now() - game.timer.startTime;
    updateTimerUI();
  }, 1000);
}

export function pauseTimer() {
  if (!game.timer.isRunning) return;
  
  game.timer.isRunning = false;
  clearInterval(game.timer.intervalId);
  game.timer.intervalId = null;
}

export function stopTimer() {
  pauseTimer();
  game.timer.elapsed = 0;
  updateTimerUI();
}

export function resetTimer() {
  stopTimer();
  startTimer();
}

function updateTimerUI() {
  const timerElement = document.getElementById('time-box')?.querySelector('p');
  if (!timerElement) return;
  
  const totalTimeInSeconds = Math.floor(game.timer.elapsed / 1000);
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;
  
  timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// get right pieces
function getRightCells(piece) {
  const cells = [];
  for (let r = 0; r < piece.length; r++) {
    const row = piece[r];
    const c = row.lastIndexOf(1); // last 1 in this row
    if (c !== -1) cells.push({ r, c });
  }
  return cells;
}

function isAgainstPieceRight(leftCells) {
  // find true board location for each piece and check if there is a 1 next to it
  let isAgainstPieceRight = false;
  let width = game.board[0].length;
  leftCells.forEach((cell) => {
    let boardRow = game.activePiece.row + cell.r;
    let boardColumn = game.activePiece.col + cell.c;
    if (boardColumn + 1 > width - 1) return;
    if (game.board[boardRow][boardColumn + 1] === 1) {
      isAgainstPieceRight = true;
    }
  });
  return isAgainstPieceRight;
}

// THESE ARE FOR TESTING DELETE THEM WHEN DONE //
window.game = game;
window.removeCompleteRow = removeCompleteRow;
window.updateScore = updateScore;
// THESE ARE FOR TESTING DELETE THEM DONE //
