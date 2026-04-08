import {
  shiftPieceDown,
  rotatePiece,
  printBoard,
  game,
  shiftPieceLeft,
  shiftPieceRight,
  spawnPiece,
  shouldSpawnNewPieceAndShiftPieceDown,
  resetGame,
} from "./GameLogic.js";
import { paintBoard, pauseGame, resumeGame } from "./GameLoop.js";

// Shift left with A or arrow left key
addEventListener("keydown", function (event) {
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    if (event.code === "ArrowLeft") event.preventDefault();
    shiftPieceLeft();
    paintBoard();
  }
});
// Shift down with S or arrow down key
addEventListener("keydown", function (event) {
  if (event.code === "KeyS" || event.code === "ArrowDown") {
    if (event.code === "ArrowDown") event.preventDefault();
    shouldSpawnNewPieceAndShiftPieceDown();
    paintBoard();
  }
});
// Shift right with D or arrow right key
addEventListener("keydown", function (event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    if (event.code === "ArrowRight") event.preventDefault();
    shiftPieceRight();
    paintBoard();
  }
});
// Rotate piece with R key
addEventListener("keydown", function (event) {
  if (event.code === "KeyR" || event.code === "ArrowUp") {
    if (event.code === "ArrowUp") event.preventDefault();
    rotatePiece();
    paintBoard();
  }
});

addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    event.preventDefault();
    let shouldSpawnNewPiece = 1;
    while (shouldSpawnNewPiece === 1) {
      shouldSpawnNewPiece = shouldSpawnNewPieceAndShiftPieceDown();
    }
    paintBoard();
  }
});

addEventListener("click", function (event) {
  if (event.target && event.target.id === "reset-button") {
    resetGame();
  }
});

// Pause game with P key
addEventListener("keydown", function (event) {
  if (event.code === "KeyP") {
    if (game.timer.isRunning) pauseGame();
  }
});

// Resume game with Escape key
addEventListener("keydown", function (event) {
  if (event.code === "Escape") {
    resumeGame();
    event.preventDefault();
  }
});

// Pause and Resume buttons
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
