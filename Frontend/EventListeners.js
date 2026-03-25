import { shiftPieceDown, rotatePiece, printBoard, game, shiftPieceLeft, shiftPieceRight, spawnPiece, shouldSpawnNewPieceAndShiftPieceDown } from "./GameLogic.js";
import { pauseGame, resumeGame } from "./GameLoop.js";  

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
        rotatePiece()
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

// Pause game with P key
addEventListener("keydown", function (event) {
    if (event.code === "KeyP") {
        pauseGame();
        event.preventDefault();
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
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('resumeBtn').addEventListener('click', resumeGame);