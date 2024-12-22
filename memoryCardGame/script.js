// Game State
let gameState = {
  difficulty: "easy",
  gridSize: 36,
  pairs: 18,
  theme: "animals",
  cards: [],
  currentScore: 0,
  moves: 0,
  timeElapsed: 0,
  timer: null,
  mode: "practice",
  customImages: [],
  players: [
    { name: "Player 1", score: 0 },
    { name: "Player 2", score: 0 }
  ],
  currentPlayerIndex: 0,
  isMultiplayer: false,
};

// Game Configurations
const gameConfigs = {
  easy: { gridSize: 16, pairs: 8 },
  medium: { gridSize: 36, pairs: 18 },
  hard: { gridSize: 64, pairs: 32 },
};

// Sound Effects
const flipSound = new Audio('sounds/flip.mp3');
const matchSound = new Audio('sounds/match.mp3');
const backgroundMusic = new Audio('sounds/background.mp3');
backgroundMusic.loop = true;

// Generate Card Values
function generateCardValues(pairs) {
  const themes = {
    animals: [
      "🐶", "🐱", "🦊", "🐻", "🐼", "🦁", "🐯", "🐸",
      "🐵", "🐰", "🦄", "🐴", "🐦", "🐧", "🐢", "🐍",
      "🦓", "🐫", "🐘", "🐳", "🐙", "🐡", "🦜", "🦥",
      "🦔", "🦦", "🦉", "🐝", "🐞", "🦋", "🦀", "🦑",
    ],
    numbers: Array.from({ length: 32 }, (_, i) => `${i + 1}`),
    symbols: [
      "❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎",
      "⭐", "🌟", "🌈", "☀️", "☁️", "⚡", "🔥", "🌊",
      "🌸", "🍀", "🍁", "🍎", "🍇", "🍉", "🍒", "🥝",
      "🥕", "🌽", "🍔", "🍟", "🍕", "🍩", "🎂", "🍫",
    ],
    custom: gameState.customImages || [],
  };

  // Increase icon size
  Object.keys(themes).forEach(theme => {
    if (theme !== 'custom') {
      themes[theme] = themes[theme].map(icon => `<span style="font-size: 2em;">${icon}</span>`);
    }
  });
  return themes[gameState.theme].slice(0, pairs);
}

// Shuffle Array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Setup Game Board
function setupGameBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  const cardValues = generateCardValues(gameState.pairs);
  const shuffledCards = shuffle([...cardValues, ...cardValues]);

  gameState.cards = shuffledCards.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));

  shuffledCards.forEach((value, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = index;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${value}</div>
      </div>
    `;
    board.appendChild(card);
  });

  board.style.gridTemplateColumns = `repeat(${Math.sqrt(gameState.gridSize)}, 1fr)`;

  if (gameState.mode === "timeTrial") startTimer();
}

// Handle Card Flip
function flipCard(cardElement) {
  const cardId = parseInt(cardElement.dataset.id);
  const card = gameState.cards[cardId];

  if (card.isFlipped || card.isMatched) return;

  card.isFlipped = true;
  cardElement.classList.add("flipped");
  flipSound.play();

  const flippedCards = gameState.cards.filter((c) => c.isFlipped && !c.isMatched);

  if (flippedCards.length === 2) {
    gameState.moves++;
    document.getElementById("moves").textContent = gameState.moves;

    if (flippedCards[0].value === flippedCards[1].value) {
      flippedCards.forEach((c) => (c.isMatched = true));
      gameState.players[gameState.currentPlayerIndex].score++;
      document.getElementById(`player${gameState.currentPlayerIndex + 1}-score`).textContent = gameState.players[gameState.currentPlayerIndex].score;
      matchSound.play();

      if (gameState.players[gameState.currentPlayerIndex].score === gameState.pairs) {
        endGame();
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach((c) => {
          c.isFlipped = false;
          document.querySelector(`[data-id='${c.id}']`).classList.remove("flipped");
        });
        if (gameState.isMultiplayer) switchPlayer();
      }, 1000);
    }
  }
}

// Switch Player
function switchPlayer() {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  document.getElementById("current-player").textContent = gameState.players[gameState.currentPlayerIndex].name;
}

// Reset Game
function resetGame() {
  gameState.currentScore = 0;
  gameState.moves = 0;
  gameState.timeElapsed = 0;
  gameState.players.forEach(player => player.score = 0);
  gameState.currentPlayerIndex = 0;
  clearInterval(gameState.timer);
  gameState.timer = null;
  document.getElementById("timer").textContent = "0:00";
  document.getElementById("score").textContent = "0";
  document.getElementById("moves").textContent = "0";
  document.getElementById("player1-score").textContent = "0";
  document.getElementById("player2-score").textContent = "0";
  document.getElementById("current-player").textContent = gameState.players[0].name;
  setupGameBoard();
  if (gameState.mode === "timeTrial") startTimer();
  toggleMultiplayerStats();
}

// Toggle Multiplayer Stats
function toggleMultiplayerStats() {
  const gameContainer = document.querySelector('.game-container');
  const multiplayerStats = document.querySelector('.multiplayer-stats');
  if (gameState.isMultiplayer) {
    gameContainer.classList.remove('single-player');
    multiplayerStats.style.display = 'block';
  } else {
    gameContainer.classList.add('single-player');
    multiplayerStats.style.display = 'none';
  }
}

// Start Timer
function startTimer() {
  gameState.timer = setInterval(() => {
    gameState.timeElapsed++;
    document.getElementById("timer").textContent = formatTime(gameState.timeElapsed);
  }, 1000);
}

// Format Time
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// End Game
function endGame() {
  clearInterval(gameState.timer);
  showVictoryAnimation();
  
  setTimeout(() => {
    alert("🎉 Congratulations! You've matched all pairs! 🎉");
  }, 1000);
}

// Show Victory Animation
function showVictoryAnimation() {
  const board = document.getElementById("game-board");
  board.classList.add("victory");
  setTimeout(() => {
    board.classList.remove("victory");
  }, 2000);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");

  board.addEventListener("click", (e) => {
    if (e.target.closest(".card")) {
      flipCard(e.target.closest(".card"));
    }
  });

  // Add touch event listeners
  board.addEventListener("touchstart", (e) => {
    if (e.target.closest(".card")) {
      flipCard(e.target.closest(".card"));
    }
  });

  document.getElementById("theme-selector").addEventListener("change", (e) => {
    gameState.theme = e.target.value;
    resetGame();
  });

  document.getElementById("difficulty-selector").addEventListener("change", (e) => {
    const difficulty = e.target.value;
    gameState.difficulty = difficulty;
    gameState.gridSize = gameConfigs[difficulty].gridSize;
    gameState.pairs = gameConfigs[difficulty].pairs;
    resetGame();
  });

  document.getElementById("mode-selector").addEventListener("change", (e) => {
    gameState.mode = e.target.value;
    resetGame();
  });

  document.getElementById("reset-button").addEventListener("click", resetGame);

  document.getElementById("custom-images-input").addEventListener("change", (e) => {
    const files = Array.from(e.target.files);
    gameState.customImages = files.map(file => URL.createObjectURL(file));
    gameState.theme = 'custom';
    resetGame();
  });

  document.getElementById("player-mode-selector").addEventListener("change", (e) => {
    gameState.isMultiplayer = e.target.value === "multiplayer";
    resetGame();
  });

  setupGameBoard();
  backgroundMusic.play();
});