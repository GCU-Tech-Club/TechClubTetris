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
    const tetromino = TETROMINOS[tetrominoKey];
    game.activePiece = {
        shape: tetromino['shapes'],
        rot: 0,
        row: 0,
        col: 3,
        id: tetromino['id']
    };
    /////////////// TESTING //////////////
    // for (let i = 0; i < 4; i++) 
    //     { 
    //         for (let j = 0; j < 4; j++) 
    //         { // Inner loop for columns
    //             if (game.activePiece.shape[i][j])
    //             {
    //                 game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
    //             }
    //         }
    // }
    /////////////// TESTING //////////////

}

// Lock the active piece into the board
function lockPiece() {
    const piece = game.activePiece;
    const currentShape = piece.shape[piece.rot];
    
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (currentShape[r][c]) {
                const boardRow = piece.row + r;
                const boardCol = piece.col + c;
                game.board[boardRow][boardCol] = piece.id;
            }
        }
    }
    
    game.activePiece = null;
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
    console.log('=== TETRIS BOARD ===');
    if(game.activePiece != null)
    {
        for (let i = 0; i < 20; i++) 
        { 
            for (let j = 0; j < 10; j++) 
            { // Inner loop for columns
                game.board[i][j] = 0;
            }
        }
        for (let i = 0; i < 4; i++) 
        { 
            for (let j = 0; j < 4; j++) 
            { // Inner loop for columns
                if (game.activePiece.shape[game.activePiece.rot][i][j])
                {
                    game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
                }
            }
        }
    }
  for (let row = 0; row < 20; row++) {
    console.log(game.board[row].join(' '));
  }
//   console.log(game.board[2].toString());
  console.log('===================');
}

// Call it
testPrintBoard();
spawnPiece('T');
testPrintBoard();
movePiece(1, 1);

testPrintBoard();
rotatePiece();
testPrintBoard();
///////////////////Testing//////////////////////
