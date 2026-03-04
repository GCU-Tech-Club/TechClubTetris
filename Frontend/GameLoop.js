import {
  setNextPiece,
  game,
  shouldSpawnNewPieceAndShiftPieceDown,
  startTimer,
  renderNextPiece,
  spawnPiece,
  getNextPiece,
} from "./GameLogic.js";
import { cells, nextPieceCells } from "./main.js";

// Piece Test (use debugger to see board, click on game then board to see the board)

function paintBoard() {
  // clear board
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      if (game.board[i][j] === 0) {
        cells[i][j].style.backgroundColor = "transparent";
      }
    }
  }
  
  // piece shadow
  // calculate how far the whole piece can drop
  let dropDistance = 0;
  let collision = false;

  while (!collision) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
          let newRow = game.activePiece.row + i + dropDistance + 1;
          let newCol = game.activePiece.col + j;

          // check if this position is part of the active piece's current position
          let isPartOfActivePiece = false;
          for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
              if (
                game.activePiece.shape[game.activePiece.rot][x][y] === 1 &&
                game.activePiece.row + x === newRow &&
                game.activePiece.col + y === newCol
              ) {
                isPartOfActivePiece = true;
              }
            }
          }

          // if newRow is out of bounds or collides with a filled cell that isn't part of the active piece, we have a collision
          if (
            newRow >= 20 ||
            (newRow >= 0 &&
              game.board[newRow][newCol] === 1 &&
              !isPartOfActivePiece)
          ) {
            collision = true;
            break;
          }
        }
      }
      if (collision) break;
    }

    if (!collision) dropDistance++;
  }

  // paint shadow using final drop distance
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        const shadowRow = game.activePiece.row + i + dropDistance;
        const shadowCol = game.activePiece.col + j;

        if (
          shadowRow >= 0 &&
          shadowRow < 20 &&
          shadowCol >= 0 &&
          shadowCol < 10
        ) {
          cells[shadowRow][shadowCol].style.backgroundColor =
            "var(--shadow)";
        }
      }
    }
  }

  // pieces
  for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        if (game.board[i][j] === 1) {
          cells[i][j].style.backgroundColor = "var(--filled)";
        }
      }
    }
  }
startTimer();
setNextPiece();
spawnPiece(getNextPiece());
renderNextPiece(nextPieceCells);
setInterval(() => {
  // do gravity
  // solidify pieces
  shouldSpawnNewPieceAndShiftPieceDown();
  renderNextPiece(nextPieceCells);
  // update score
  // paint board
  paintBoard();
}, 200);
