import { spawnPiece, printBoard, game, rotatePiece, shiftPieceDown, shiftLeft} from "./GameLogic.js";

// Piece Test (use debugger to see board, click on game then board to see the board)

spawnPiece("T");
shiftPieceDown();
shiftPieceDown();
shiftPieceDown();
shiftPieceDown();
shiftLeft();
rotatePiece();