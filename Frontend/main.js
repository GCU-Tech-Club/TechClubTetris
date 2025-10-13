const COLS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cols')) || 10;
const ROWS = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--rows')) || 20;

const boardEl = document.getElementById('board');

const cells = [];
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
