import {
  spawnPiece,
  printBoard,
  game,
  rotatePiece,
  shiftPieceDown,
  shiftPieceRight,
  shiftPieceLeft,
  shouldSpawnNewPieceAndShiftPieceDown,
} from "./GameLogic.js";
import { cells } from "./main.js";

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
        cells[i][j].style.backgroundColor = "red";
      }
    }
  }
}
spawnPiece("T");
const gameInterval = setInterval(() => {
  // do gravity
  // solidify pieces
  shouldSpawnNewPieceAndShiftPieceDown();
  // update score
  // paint board
  paintBoard();
  console.log(game.board);
}, 200);
