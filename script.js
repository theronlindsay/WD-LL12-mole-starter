// DOM SELECT ELEMENTS
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const moleCountDisplay = document.getElementById('moleCount');
const startButton = document.getElementById('startButton');

// Game variables
let score = 0;
let timeLeft = 15; // Game duration in seconds
let gameTimer = null; // Timer interval reference

// Load sound effect
const popSound = new Audio('sounds/pop.mp3');

// Keyboard mapping for holes
// The holes are arranged in a 3x3 grid:
// 1 2 3
// 4 5 6  
// 7 8 9
const keyMap = {
  'q': 0, '7': 0,  // Top-left hole (hole 1, index 0)
  'w': 1, '8': 1,  // Top-middle hole (hole 2, index 1)
  'e': 2, '9': 2,  // Top-right hole (hole 3, index 2)
  'a': 3, '4': 3,  // Middle-left hole (hole 4, index 3)
  's': 4, '5': 4,  // Middle-center hole (hole 5, index 4)
  'd': 5, '6': 5,  // Middle-right hole (hole 6, index 5)
  'z': 6, '1': 6,  // Bottom-left hole (hole 7, index 6)
  'x': 7, '2': 7,  // Bottom-middle hole (hole 8, index 7)
  'c': 8, '3': 8   // Bottom-right hole (hole 9, index 8)
};

// Function to handle whacking a mole
function whackMole(hole) {
  // Check if the hole has a mole that's up
  if (!hole.classList.contains('up')) return;

  // Increase score and update display
  score++;
  scoreDisplay.textContent = score;
  
  // Hide the mole
  hole.classList.remove('up');

  // Play sound effect
  popSound.currentTime = 0; // Reset sound to beginning
  popSound.play();
}

// Function to update countdown timer
function updateTimer() {
  timeLeft--;
  
  // Update timer display if it exists
  const timerDisplay = document.getElementById('timer');
  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;
  }
  
  // End game when timer reaches 0
  if (timeLeft <= 0) {
    endGame();
  }
}

// Function to end the game
function endGame() {
  // Stop the game
  gameRunning = false;
  
  // Clear the timer
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  
  // Re-enable start button
  startButton.disabled = false;
  
  // Show game over modal
  showGameOverModal();
}

// Function to show game over modal
function showGameOverModal() {
  // Create modal backdrop
  const modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'modal-backdrop';
  
  // Create modal content
  const modal = document.createElement('div');
  modal.className = 'game-over-modal';
  
  // Create modal content HTML
  modal.innerHTML = `
    <h2>Game Over!</h2>
    <p>Final Score: <span class="final-score">${score}</span></p>
    <p>Moles Whacked: <span class="final-moles">${score}</span></p>
    <p>Total Moles: <span class="total-moles">${moleCount}</span></p>
    <button id="playAgainButton" class="play-again-btn">Play Again</button>
    <button id="closeModalButton" class="close-modal-btn">Close</button>
  `;
  
  // Add modal to backdrop
  modalBackdrop.appendChild(modal);
  
  // Add backdrop to body
  document.body.appendChild(modalBackdrop);
  
  // Add event listeners for modal buttons
  document.getElementById('playAgainButton').addEventListener('click', function() {
    closeModal();
    startGameWithTimer();
  });
  
  document.getElementById('closeModalButton').addEventListener('click', closeModal);
  
  // Close modal when clicking backdrop
  modalBackdrop.addEventListener('click', function(event) {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
}

// Function to close modal
function closeModal() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

// Function to start game with timer
function startGameWithTimer() {
  // Check if required elements exist
  if (!scoreDisplay || !moleCountDisplay || !startButton) {
    console.error('Required DOM elements not found');
    return;
  }
  
  // Check if showMole function exists
  if (typeof showMole !== 'function') {
    console.error('showMole function not found');
    return;
  }
  
  // Reset timer
  timeLeft = 15;
  
  // Update timer display
  const timerDisplay = document.getElementById('timer');
  if (timerDisplay) {
    timerDisplay.textContent = timeLeft;
  }
  
  // Start countdown timer (update every second)
  gameTimer = setInterval(updateTimer, 1000);
  
  // Reset game variables
  score = 0;
  moleCount = 0;
  gameRunning = true;

  // Update displays
  scoreDisplay.textContent = score;
  moleCountDisplay.textContent = moleCount;
  startButton.disabled = true;

  // Start showing moles
  showMole();
}

// Initialize game board
function initializeGame() {
  holes.forEach((hole) => {
    const mole = document.createElement('div');
    mole.className = 'mole';
    hole.appendChild(mole);

    // Add click event listener for mouse clicks
    hole.addEventListener('click', () => {
      whackMole(hole);
    });
  });
}

// Add keyboard event listener
document.addEventListener('keydown', function(event) {
  // Get the pressed key in lowercase
  const key = event.key.toLowerCase();
  
  // Check if spacebar was pressed to start the game
  if (key === ' ') {
    // Prevent default spacebar behavior (scrolling)
    event.preventDefault();
    // Start the game if the button is not disabled
    if (!startButton.disabled) {
      startGameWithTimer();
    }
    return;
  }
  
  // Check if the key is mapped to a hole
  if (keyMap.hasOwnProperty(key)) {
    // Get the hole index from the key mapping
    const holeIndex = keyMap[key];
    // Get the corresponding hole element
    const hole = holes[holeIndex];
    // Whack the mole in that hole
    whackMole(hole);
  }
});

startButton.addEventListener('click', startGameWithTimer);
initializeGame();
