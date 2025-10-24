import { TETROMINOS } from './Pieces.js';

console.log("this is where the board goes");
console.log(TETROMINOS);
// Game state
const game = {
  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
  activePiece: null
};


// Create a new active piece
function spawnPiece(tetrominoKey) { 
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

// Rotate the active piece
function rotatePiece() {
    if (game.activePiece) {
        game.activePiece.rot = (game.activePiece.rot + 1) % 4;
    }
}

// Move the active piece
function movePiece(deltaRow, deltaCol) {
    if (game.activePiece) {
        game.activePiece.row += deltaRow;
        game.activePiece.col += deltaCol;
    }
}

///////////////////Testing//////////////////////
function testPrintBoard() {
    // console.log(game.board)

    console.log('=== TETRIS BOARD ===');
    

    for(let i = 0; i < 20; i++)
    {
        console.log(game.board[i].toString());
    }
  console.log(game.board[2].toString());
  console.log('===================');
}

// Call it
testPrintBoard();
spawnPiece('J');
testPrintBoard();



///////////////////Testing//////////////////////
