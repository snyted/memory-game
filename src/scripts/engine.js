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
// -- DOM --
const timerEl = document.getElementById("timer");
const openRankingSvg = document.getElementById("openRankingSvg");
const modalEl = document.querySelector(".modal");
const closeButtons = document.querySelectorAll(
  ".close-button, .x-close-button"
);
const rankingList = document.getElementById("rankingList");

// -- Vars
const totalMatchesToWin = 8;
let totalSeconds = 0;
let totalMatches = 0;
let timerInterval;
let nickname;

let openCards = [];
// -- States --
let isProcessing = false;
let isStarted = false;
let isPopulated = false;

function addCards() {
  let shuffleEmojis = emojis.sort(() => Math.random() - 0.5);

  emojis.forEach((e, i) => {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = shuffleEmojis[i];
    box.onclick = handleClick;
    document.querySelector(".game").appendChild(box);
  });
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

// --- Timer Functions ---

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

  timerInterval = setInterval(() => {
    totalSeconds++;
    timerEl.textContent = formatTime(totalSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isStarted = false;
  nickname = idGenerator();
  console.log(totalSeconds)
}

function matchesCount() {
  totalMatches++;
  console.log(totalMatches);
  if (totalMatches === totalMatchesToWin) {
    stopTimer();
  }
}

// --- Ranking Functions  ---

function rankingSave(timer) {
  formatTime(timer);


}

function populateRanking(timer, nickname) {
  if (!isPopulated) {
    const noDataMessage = document.createElement("li");
    noDataMessage.innerHTML  = `<strong>Player</strong>: ${nickname}&nbsp;|&nbsp;<strong>Tempo</strong>: ${timer}`;

    noDataMessage.style.justifyContent = "center";
    noDataMessage.style.backgroundColor = "transparent";
    noDataMessage.style.boxShadow = "none";
    noDataMessage.style.border = "none";
    noDataMessage.style.padding = "10px 0";
    noDataMessage.style.fontWeight = "normal";

    rankingList.appendChild(noDataMessage);

    isPopulated = true;
  } else {
    return;
  }
}

// Essa função é para pessoas que não colocarem seu nick, vai gerar um aleatório.
function idGenerator() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 7;
  let result = "";
  const caracteresLength = caracteres.length;
  for (let i = 0; i < length; i++) {
    result += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
  }
  return result;
}

// --- Event Listeners for Ranking ---
openRankingSvg.addEventListener("click", () => {
  modalEl.style.display = "flex";
  populateRanking(totalSeconds, nickname);
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modalEl.style.display = "none";
  });
});

init();
