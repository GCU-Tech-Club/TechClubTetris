import { shiftPieceDown, printBoard, game} from " ./GameLogic.js";

console.log("EventListeners.js")

addEventListener("keydown", function(event) {
    if (event.code === "Space"){
       while (game.activePiece != null) {
        shiftPieceDown();  
       }
       event.preventDefault();
    }
});
