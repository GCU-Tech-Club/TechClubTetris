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
                if(game.board[i][j] == 1)
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

    for(let i = 0; i < 20; i++)
    {
        console.log(game.board[i].toString());
    }
//   console.log(game.board[2].toString());
  console.log('===================');
}

// Call it
//testPrintBoard();
spawnPiece('T');
testPrintBoard();
movePiece(5, 1);

testPrintBoard();
rotatePiece();
testPrintBoard();
lockPiece();
testPrintBoard();
spawnPiece('T');
testPrintBoard();


///////////////////Testing//////////////////////
