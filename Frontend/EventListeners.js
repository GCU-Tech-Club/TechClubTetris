import { shiftPieceDown, rotatePiece, printBoard, game, shiftPieceLeft, shiftPieceRight} from "./GameLogic.js";

// Shift left with A or arrow left key
addEventListener("keydown", function(event) {
    if (event.code === "KeyA" || event.code === "ArrowLeft"){
        console.log("left");
       shiftPieceLeft();
       event.preventDefault();
       console.log(game.board);
    }
});
// Shift down with S or arrow down key
addEventListener("keydown", function(event) {
    if (event.code === "KeyS" || event.code === "ArrowDown"){
       shiftPieceDown();
       event.preventDefault();
              console.log(game.board);

    }
});
// Shift right with D or arrow right key
addEventListener("keydown", function(event) {
    if (event.code === "KeyD" || event.code === "ArrowRight"){
       shiftPieceRight();
       event.preventDefault();
       console.log(game.board);

    }
});
// Rotate piece with R key
addEventListener("keydown", function(event) {
    if (event.code === "KeyR" || event.code === "ArrowUp"){
       rotatePiece()
       event.preventDefault();
       console.log(game.board);
    }
});

addEventListener("keydown", function(event) {
    if (event.code === "Space"){
       let x = 1;
       while (x === 1) {
        x = shiftPieceDown();  
       }
       event.preventDefault();
    }
});
