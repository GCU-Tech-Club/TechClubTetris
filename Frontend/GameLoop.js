import {
  spawnPiece,
  game,
  shouldSpawnNewPieceAndShiftPieceDown,
} from "./GameLogic.js";
import { cells, nextPieceCells } from "./main.js";

// Piece Test (use debugger to see board, click on game then board to see the board)

function paintBoard() {
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 10; j++) {
      if (game.board[i][j] === 0) {
        cells[i][j].style.backgroundColor = "transparent";
      }
    }
  }
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
  // update score
  // paint board
  paintBoard();
}, 200);
