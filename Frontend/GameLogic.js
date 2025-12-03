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
  if (!game.activePiece) return;

  // Erase current piece from the board
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
        game.board[i + game.activePiece.row][j + game.activePiece.col] = 0;
      }
    }
  }

  const { row, col, shape } = game.activePiece;
  const nextRot = (game.activePiece.rot + 1) % shape.length;

  // Try shifts to try to rotate
  const shifts = [0, -1, -2];

  let appliedShift = null;
  for (const shift of shifts) {
    if (canPlace(shape[nextRot], row + shift, col)) {
      game.activePiece.rot = nextRot;
      game.activePiece.row = row + shift;
      appliedShift = shift;
      break;
    }
  }

  // If rotation couldn't be applied, redraw original orientation and bail
  if (appliedShift === null) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (shape[game.activePiece.rot][i][j] === 1) {
          game.board[row + i][col + j] = 1;
        }
      }
    }
    return; // no rotation
  }

  // Draw rotated piece
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[game.activePiece.rot][i][j] === 1) {
        game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;;
      }
    }
  }
}


// Return true if a 4x4 shape can be placed at (row,col) fully in-bounds
// and not overlapping any solidified cells (marked as 2).
function canPlace(shape, row, col) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[i][j] !== 1) continue;

      const y = row + i;
      const x = col + j;

      // bounds
      if (y < 0 || y >= 20 || x < 0 || x >= 10) return false;
      // collision with solidified cells
      if (game.board[y][x] !== 0) return false;
    }
  }
  return true;
}

// Shift piece down
export function shiftPieceDown()
{
    if (!game.activePiece) return;
      
    // Erase the active piece off the board (still exists in the activePiece var)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) game.board[game.activePiece.row + i][game.activePiece.col + j] = 0;
        }
    }

    // If we should solidify, set the active piece to null
    if(solidifyPiece()) 
    {
      // Put the new piece on the board where it currently is
      for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
              if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;
          }
      }
       game.activePiece = null; 
       return;
    }

    // Move the piece down if we shouldn't solidify   
    // Increment the row to move the active piece down
    game.activePiece.row += 1;
        
    // Put the new piece on the board
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) game.board[game.activePiece.row + i][game.activePiece.col + j] = 1;
        }
    }
}

// Checks if we should solidify piece, returns boolean
export function solidifyPiece() {
  const nextRow = game.activePiece.row + 1;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.activePiece.shape[game.activePiece.rot][i][j] !== 1) continue;

      const y = nextRow + i;
      const x = game.activePiece.col + j;

      // bounds first
      if (y >= 20 || x < 0 || x >= 10) return true;

      // collision with settled blocks (with your current single-layer board)
      if (game.board[y][x] === 1) return true;
    }
  }
  return false; // safe to move down
}

export function printBoard() {
    for(let i = 0; i < 20; i++)
    {
        console.log(game.board[i].toString());
    }
    console.log(game.board[2].toString());
}

export function shiftRight() {
    let pieceLength = 0;
    const lenghts = game.activePiece.shape[game.activePiece.rot].map(row => row.filter(num => num === 1).length);
    pieceLength =Math.max(...lenghts);

    let isAgainstEdge = false;

    if ((game.activePiece.col === 0) || (game.activePiece.col + pieceLength - 1 === 9)) {
            isAgainstEdge = true;
            return;
        }

    // Erase the current piece off the board 
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1)
                game.board[i+ game.activePiece.row][j + game.activePiece.col] = 0;
        }
    }

    if(!isAgainstEdge)
    {
        game.activePiece.col += 1;
        for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
                game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
            }
        }
    }
}
}
  console.log(game.board);