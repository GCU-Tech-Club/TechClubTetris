import { createSession, getHighScores, saveHighScore } from "./ScoresDataAccess.js";

createSession();

let currentScore = 0;

const COLS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols')) || 10;
const ROWS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rows')) || 20;

const boardEl = document.getElementById('board');

export const cells = [];
for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
        const cell = document.createElement('div'); 
        cell.className = 'cell'; 
        cell.setAttribute('role', 'gridcell');
        cell.dataset.row = r;
        cell.dataset.col = c; 
        boardEl.appendChild(cell);
        row.push(cell);
    }
    cells.push(row);
}

async function renderHighScores() {
    const data = await getHighScores();
    const scores = Array.isArray(data) ? data : (data.scores ?? data.data ?? []);
    const list = document.getElementById('highScoreList');
    list.innerHTML = '';
    scores.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.initials} — ${entry.score}`;
        list.appendChild(li);
    });
}

export async function showGameOver(score) {
    currentScore = score;
    document.getElementById('finalScore').textContent = `Score: ${score}`;
    document.getElementById('submitScoreSection').classList.remove('hidden');
    document.getElementById('gameOverPopup').classList.remove('hidden');
    await renderHighScores();
}

async function submitScore() {
    const initials = document.getElementById('initialsInput').value.trim().toUpperCase();
    if (!initials) return;

    await saveHighScore(initials, currentScore);
    document.getElementById('submitScoreSection').classList.add('hidden');
    await renderHighScores();
}

document.getElementById('submitScoreBtn').addEventListener('click', submitScore);   

export function playAgain() {
    document.getElementById('gameOverPopup').classList.add('hidden');
    location.reload();
}

document.getElementById('playAgainBtn').addEventListener('click', playAgain);


const nextPieceGrid = document.getElementById("mini");

export const nextPieceCells = [];
for (let r = 0; r < 4; r++) {
  const row = [];
  for (let c = 0; c < 4; c++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.minWidth = "0";
    cell.style.minHeight = "0";
    nextPieceGrid.appendChild(cell);
    row.push(cell);
  }
  nextPieceCells.push(row);
}
