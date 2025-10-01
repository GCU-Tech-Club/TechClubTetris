console.log("this is where the board goes");
// Game state
const game = {
  board: Array.from({ length: 20 }, () => Array(10).fill(0)),
  activePiece: null
};



// Create a new active piece
function spawnPiece(tetrominoKey) {
  const tetromino = TETROMINOS[tetrominoKey];
  game.activePiece = {
    shape: tetromino.shapes,
    rot: 0,
    row: 0,
    col: 3,
    id: tetromino.id
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