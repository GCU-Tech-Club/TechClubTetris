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
