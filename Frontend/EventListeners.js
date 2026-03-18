import {
  rotatePiece,
  game,
  shiftPieceLeft,
  shiftPieceRight,
  spawnPiece,
  shouldSpawnNewPieceAndShiftPieceDown,
  resetGame,
} from "./GameLogic.js";

// Shift left with A or arrow left key
addEventListener("keydown", function (event) {
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    console.log("left");
    shiftPieceLeft();
    event.preventDefault();
    console.log(game.board);
  }
});
// Shift down with S or arrow down key
addEventListener("keydown", function (event) {
  if (event.code === "KeyS" || event.code === "ArrowDown") {
    shouldSpawnNewPieceAndShiftPieceDown();
    event.preventDefault();
    console.log(game.board);
  }
});
// Shift right with D or arrow right key
addEventListener("keydown", function (event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    shiftPieceRight();
    event.preventDefault();
    console.log(game.board);
  }
});
// Rotate piece with R key
addEventListener("keydown", function (event) {
  if (event.code === "KeyR" || event.code === "ArrowUp") {
    rotatePiece();
    event.preventDefault();
    console.log(game.board);
  }
});

addEventListener("keydown", function (event) {
  if (event.code === "Space") {
    let shouldSpawnNewPiece = 1;
    while (shouldSpawnNewPiece === 1) {
      shouldSpawnNewPiece = shouldSpawnNewPieceAndShiftPieceDown();
    }
    event.preventDefault();
  }
});

addEventListener("click", function (event) {
  if (event.target && event.target.id === "reset-button") {
    resetGame();
  }
});
