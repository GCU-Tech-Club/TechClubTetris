import {
  setNextPiece,
  game,
  shouldSpawnNewPieceAndShiftPieceDown,
  startTimer,
  renderNextPiece,
  spawnPiece,
  getNextPiece,
} from "./GameLogic.js";
import { cells, nextPieceCells, renderHighScores } from "./main.js";

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
spawnPiece("T");

//reusable function for game loop, will be called every tick
function tick() {
  if (game.isOver) {
    clearInterval(gameInterval);
    return;
  }
  shouldSpawnNewPieceAndShiftPieceDown();
  renderNextPiece(nextPieceCells);
  paintBoard();
}



let gameInterval = setInterval(tick, 200);

//pause and resume functions
export function pauseGame() {
  clearInterval(gameInterval);
  document.getElementById('pausePopup').classList.remove('hidden')
  renderHighScores(document.getElementById('pausePopup').querySelector('ol'));
}

export function resumeGame() {
  document.getElementById('pausePopup').classList.add('hidden')
  gameInterval = setInterval(tick, 200);
}


