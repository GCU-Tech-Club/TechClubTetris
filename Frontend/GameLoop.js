import { spawnPiece, printBoard, game, rotatePiece, shiftPieceDown, shiftRight, shiftLeft } from "./GameLogic.js";
import { cells } from "./main.js";

// Piece Test (use debugger to see board, click on game then board to see the board)
spawnPiece("T");
for (let i = 0; i < 10; i++)
{
    for(let j = 0; j < 20; j++)
    {
        if(game.board[i][j] === 1)
        {
            cells[i][j].style.backgroundColor = "red";
        }
    }
}