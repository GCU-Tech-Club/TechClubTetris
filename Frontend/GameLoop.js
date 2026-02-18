import {
  spawnPiece,
  printBoard,
  game,
  rotatePiece,
  shiftPieceDown,
  shiftPieceRight,
  shiftPieceLeft,
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
setInterval(() => {
  // do gravity
  // solidify pieces
  let shouldSpawnNewPiece = shiftPieceDown();
  if (shouldSpawnNewPiece === -1) {
    const pieces = ["T", "L", "O", "I", "S", "Z", "J"];
    let randomPieceSelect = Math.floor(Math.random() * 6);
    spawnPiece(pieces[randomPieceSelect]);
  }
  // update score
  // paint board
  paintBoard();
  console.log(game.board);
}, 200);
