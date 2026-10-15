const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const modeSelect = document.getElementById('game-mode');

// All 8 possible winning combinations
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isVSComputer = false;

// Initialize event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeSelect.addEventListener('change', handleModeChange);

function handleModeChange(e) {
  isVSComputer = e.target.value === 'pvc';
  restartGame();
}

// Handle player click on a cell
function handleCellClick(event) {
  const clickedCell = event.target;
  const cellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[cellIndex] !== '' || !gameActive) return;

  makeMove(clickedCell, cellIndex, currentPlayer);

  if (gameActive && isVSComputer && currentPlayer === 'O') {
    // Small delay for natural computer turn
    setTimeout(computerMove, 400);
  }
}

// Execute move and check game state
function makeMove(cellElement, index, player) {
  gameState[index] = player;
  cellElement.innerText = player;
  cellElement.classList.add(player.toLowerCase());

  if (checkWin()) {
    statusText.innerText = `Player ${player} Wins! 🎉`;
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusText.innerText = `It's a Draw! 🤝`;
    gameActive = false;
    return;
  }

  // Switch turn
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.innerText = isVSComputer && currentPlayer === 'O' 
    ? "Computer's Turn..." 
    : `Player ${currentPlayer}'s Turn`;
}

// Basic AI logic for Computer turn
function computerMove() {
  if (!gameActive) return;

  // Find all empty cells
  const emptyIndices = gameState
    .map((val, idx) => (val === '' ? idx : null))
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return;

  // Pick a random available cell
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const targetCell = document.querySelector(`.cell[data-index='${randomIndex}']`);

  makeMove(targetCell, randomIndex, 'O');
}

// Check winning conditions
function checkWin() {
  return winningConditions.some(condition => {
    const [a, b, c] = condition;
    return (
      gameState[a] !== '' &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    );
  });
}

// Check for a tie/draw
function checkDraw() {
  return gameState.every(cell => cell !== '');
}

// Reset the game board and state
function restartGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusText.innerText = "Player X's Turn";

  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('x', 'o');
  });
}
