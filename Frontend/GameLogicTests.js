import { shiftLeft, spawnPiece, game } from "./GameLogic.js";
import { TETROMINOS } from './Pieces.js';

const tests = [];

function test(name, fn) {
    tests.push({ name, fn });
}

function runTests() {
    let passed = 0;
    tests.forEach(({ name, fn }) => {
        try {
            fn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (e) {
            console.error(`❌ ${name}`);
            console.error(e);
        }
    });
    console.log(`\n${passed}/${tests.length} tests passed`);
}

// Example code
function multiply(a, b) { return a * b; }

// Example tests
test("2*3 = 6", () => {
    if (multiply(2, 3) !== 6) throw new Error("Expected 6");
});

test("10*0 = 0", () => {
    if (multiply(10, 0) !== 0) throw new Error("Expected 0");
});

test("shift piece left once", () => {
    // Arrange
    /*const game = {
        board: Array.from({ length: 20 }, () => Array(10).fill(0)),
        activePiece: null
    };*/
    const tetromino = TETROMINOS['T']; // 'T'
    spawnPiece('T');

    const expectedResult = {
        board: Array.from({ length: 20 }, () => Array(10).fill(0)),
        activePiece: {
            shape: tetromino['shapes'],
            rot: 0,
            row: 0,
            col: 2,
            id: tetromino['id']
        }
    }
    // make the active piece for the expected result show up on the expected result game board
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) { // Inner loop for columns
            if (game.activePiece.shape[game.activePiece.rot][i][j] === 1) {
                game.board[i + game.activePiece.row][j + game.activePiece.col] = 1;
            }
        }
    }
    // Act
    shiftLeft();
    // Assert
    if (game.board === expectedResult.board && game.activePiece === expectedResult.activePiece);
})

runTests();
