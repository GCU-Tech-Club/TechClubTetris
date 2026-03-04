import { getHighScores } from "./ScoresDataAccess.js";

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

export async function showGameOver(score) {
    document.getElementById('finalScore').textContent = `Score: ${score}`;
    document.getElementById('gameOverPopup').classList.remove('hidden');

    const scores = await getHighScores();
    const list = document.getElementById('highScoreList');
    list.innerHTML = '';
    scores.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.initials} — ${entry.score}`;
        list.appendChild(li);
    });
}   

export function playAgain() {
    document.getElementById('gameOverPopup').classList.add('hidden');
    location.reload();
}

document.getElementById('playAgainBtn').addEventListener('click', playAgain);
