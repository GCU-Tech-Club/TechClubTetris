import { TETROMINOS } from './Pieces.js';

console.log("this is where the board goes");
console.log(TETROMINOS);
// Game state
export const game = {
  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
  activePiece: null
};

export function getGameState()
{
    return game;
}

// Create a new active piece
export function spawnPiece(tetrominoKey) { 
    const tetromino = TETROMINOS[tetrominoKey]; // 'T'
    game.activePiece = {
        shape: tetromino['shapes'],
        rot: 0,
        row: 0,
        col: 3,
        id: tetromino['id']
    };

    if(game.activePiece != null)
    {
        // for (let i = 0; i < 20; i++) 
        // { 
        //     for (let j = 0; j < 10; j++) 
        //     { // Inner loop for columns
        //         if(game.board[i][j] == 1)
        //             game.board[i][j] = 0;
        //     }
        // }
        console.log(game.activePiece.shape[game.activePiece.rot]);
        for (let i = 0; i < 4; i++) 
        { 
            for (let j = 0; j < 4; j++) 
            { // Inner loop for columns
                if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
                {
                    game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
                }
            }
        }
    }
}

// Change the active piece to the next rotation
export function rotatePiece() {
    // Erase the current piece off the board (still exists in the activePiece var)
    for(let i = 0; i < 20; i++)
    {
        for(let j = 0; j < 10; j++)
        {
            if(game.board[i][j] === 1)
                game.board[i][j] = 0;
        }
    }

    // Reset to first rotation if last, go to next rotation if not
    if(game.activePiece.shape.length === 4)
        if(game.activePiece.rot === 3)
            game.activePiece.rot = 0;
        else
            // Else go to next rotation
            game.activePiece.rot += 1;
    if(game.activePiece.shape.length === 2)
        if(game.activePiece.rot === 1)
            game.activePiece.rot = 0;
        else
            // Else go to next rotation
            game.activePiece.rot += 1;

    // Out of bounds check (for now)
    // If the rotation is able to go out of bounds
    if(game.activePiece.shape.length === 4 && game.activePiece.rot === 1 || 3)
    {
        // If the rotated piece is out of bounds, move it back in (+3 is the width of the piece)
        if(game.activePiece.col + 3 > 10)
            col--
    }
    // Put the new piece on the board
    for (let i = 0; i < 4; i++) 
    { 
        for (let j = 0; j < 4; j++) 
        { 
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
            {
                game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
            }
        }
    }
}

export function printBoard() {
    for(let i = 0; i < 20; i++)
    {
        console.log(game.board[i].toString());
    }
    console.log(game.board[2].toString());
}