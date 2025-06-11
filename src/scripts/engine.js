const emojis = [
  "🐸",
  "🐸",
  "🐔",
  "🐔",
  "🐴",
  "🐴",
  "🐶",
  "🐶",
  "🐷",
  "🐷",
  "🐵",
  "🐵",
  "🐱",
  "🐱",
  "🐰",
  "🐰",
];

const timerEl = document.getElementById("timer");
let totalSeconds = 0;
let totalMatches = 0;
const totalMatchesToWin = 8;
let timerInterval;

let openCards = [];
let isProcessing = false;
let isStarted = false;

function addCards() {
  let shuffleEmojis = emojis.sort(() => Math.random() - 0.5);

  for (let i = 0; i < emojis.length; i++) {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffleEmojis[i];
    box.onclick = handleClick;
    document.querySelector(".game").appendChild(box);
  }
}

function handleClick() {
  if (!isStarted) { 
    startTimer();   
    isStarted = true;
  }

  if (
    this.classList.contains("open") ||
    this.classList.contains("match") ||
    isProcessing
  ) {
    return;
  }

  this.classList.add("open");
  openCards.push(this);

  if (openCards.length === 2) {
    isProcessing = true;

    if (openCards[0].innerHTML === openCards[1].innerHTML) {
      openCards.forEach((card) => {
        card.classList.add("match");
      });
      matchesCount();
      openCards = [];
      isProcessing = false;
    } else {
      setTimeout(() => {
        openCards.forEach((card) => {
          card.classList.remove("open");
        });
        openCards = [];
        isProcessing = false;
      }, 1000);
    }
  }
}

function init() {
  addCards();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // padStart(2, '0') garante que sempre tenha 2 dígitos
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function startTimer() {
  clearInterval(timerInterval);

  totalSeconds = 0;

  timerEl.textContent = formatTime(totalSeconds);

  timerInterval = setInterval(() => {
    totalSeconds++;
    timerEl.textContent = formatTime(totalSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isStarted = false;
}

function matchesCount() {
  totalMatches++
  console.log(totalMatches)
  if (totalMatches === totalMatchesToWin) {
    stopTimer();
  }
}

init();
