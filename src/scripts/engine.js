// --- DOM Elements ---
const gameContainer = document.querySelector(".game");
const timerEl = document.getElementById("timer");

// ATUALIZADO: Seletores baseados no seu HTML e nomes de variáveis
const nicknameModal = document.querySelector(".nickname-modal"); // Seu .nickname-modal
const nicknameInput = document.getElementById("nickname");      // Seu #nickname
const saveNicknameBtn = document.getElementById("saveNicknameBtn"); // O novo botão Salvar que adicionamos
const skipButton = document.querySelector(".skip-button");      // Seu .skip-button
const finalTimeDisplay = document.getElementById("finalTimeDisplay"); // O span dentro do p do modal de nick

const modalEl = document.querySelector(".modal"); // Seu .modal para o ranking
const openRankingSvg = document.getElementById("openRankingSvg");
const rankingList = document.getElementById("rankingList");
const closeButtons = document.querySelectorAll(
  ".close-button, .x-close-button"
);

// --- Global Variables ---
const emojis = [
  "🐸", "🐸", "🐔", "🐔", "🐴", "🐴", "🐶", "🐶",
  "🐷", "🐷", "🐵", "🐵", "🐱", "🐱", "🐰", "🐰",
];
const totalMatchesToWin = emojis.length / 2;
let totalSeconds = 0;
let totalMatches = 0;
let timerInterval;
let openCards = [];
let ranking = []; // Array para o ranking em memória

// --- States ---
let isProcessing = false;
let isGameStarted = false;
let isGameFinished = false;

// --- Utility Functions ---
function idGenerator() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 7;
  let result = '';
  const caracteresLength = caracteres.length;
  for (let i = 0; i < length; i++) {
    result += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
  }
  return result;
}

function parseTimeToSeconds(timeString) {
  const parts = timeString.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return Infinity;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

// --- Game Logic Functions ---
function addCards() {
  gameContainer.innerHTML = '';
  let shuffleEmojis = [...emojis].sort(() => Math.random() - 0.5);

  shuffleEmojis.forEach((e) => {
    let box = document.createElement("div");
    box.className = "item";
    box.innerHTML = e;
    box.onclick = handleClick;
    gameContainer.appendChild(box);
  });
}

function handleClick() {
  if (!isGameStarted) {
    startTimer();
    isGameStarted = true;
  }

  if (
    this.classList.contains("open") ||
    this.classList.contains("match") ||
    isProcessing ||
    isGameFinished
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

function initGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  totalSeconds = 0;
  timerEl.textContent = "00:00";
  totalMatches = 0;
  openCards = [];
  isProcessing = false;
  isGameStarted = false;
  isGameFinished = false;

  addCards();
}

function startTimer() {
  clearInterval(timerInterval);
  
  timerInterval = setInterval(() => {
    totalSeconds++;
    timerEl.textContent = formatTime(totalSeconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isGameStarted = false;
  isGameFinished = true;
  
  nicknameFunc(); // Chama a função para mostrar o modal de nickname
}

function matchesCount() {
  totalMatches++;
  if (totalMatches === totalMatchesToWin) {
    stopTimer();
  }
}

// --- Nickname Modal Functions ---
function nicknameFunc() {
  if (isGameFinished) {
    finalTimeDisplay.textContent = formatTime(totalSeconds);
    nicknameInput.value = ''; 
    nicknameModal.style.display = 'flex';
    setTimeout(() => {
        nicknameModal.classList.add('active'); 
        nicknameInput.focus();
    }, 10);
  }
}

// Função para fechar o modal de nickname
function closeNicknameModal() {
    nicknameModal.classList.remove('active');
    setTimeout(() => {
        nicknameModal.style.display = 'none';
    }, 300);
}


// --- Ranking Functions ---
function saveRanking(playerName, time) {
    ranking.push({ name: playerName, time: time });
    
    ranking.sort((a, b) => {
        const timeAInSeconds = parseTimeToSeconds(a.time);
        const timeBInSeconds = parseTimeToSeconds(b.time);
        return timeAInSeconds - timeBInSeconds;
    });

    ranking = ranking.slice(0, 10); // Limita aos 10 melhores
    
    if (modalEl.classList.contains('active')) {
        populateRanking(); 
    }
}

function populateRanking() {
    rankingList.innerHTML = ''; // Limpa a lista existente

    if (ranking.length === 0) {
        const noDataMessage = document.createElement("li");
        noDataMessage.innerHTML = "Nenhum tempo registrado ainda.";
        noDataMessage.style.justifyContent = "center";
        noDataMessage.style.backgroundColor = "transparent";
        noDataMessage.style.boxShadow = "none";
        noDataMessage.style.border = "none";
        noDataMessage.style.padding = "10px 0";
        noDataMessage.style.fontWeight = "normal";
        rankingList.appendChild(noDataMessage);
    } else {
        ranking.forEach((player, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span class="rank-position">${index + 1}º</span>
                <span class="rank-name"><strong>Player</strong>: ${player.name}</span> 
                <span class="rank-time">&nbsp;|&nbsp;<strong>Tempo</strong>: ${player.time}</span>
            `;
            rankingList.appendChild(listItem);
        });
    }
}

// --- Event Listeners ---

saveNicknameBtn.addEventListener('click', () => {
    let playerName = nicknameInput.value.trim();
    if (playerName === "") {
        playerName = idGenerator();
    }
    saveRanking(playerName, finalTimeDisplay.textContent);
    closeNicknameModal();
    initGame(); 
});

// Listener para o botão "Pular" do modal de nickname (seu skipButton)
skipButton.addEventListener('click', () => {
    const playerName = idGenerator();
    saveRanking(playerName, finalTimeDisplay.textContent);
    closeNicknameModal();
    initGame(); 
});

nicknameModal.querySelector('.close-button').addEventListener('click', closeNicknameModal);

nicknameModal.addEventListener('click', (event) => {
    if (event.target === nicknameModal) {
        closeNicknameModal();
    }
});


// Event Listeners para o Modal de Ranking
openRankingSvg.addEventListener("click", () => {
    modalEl.style.display = "flex"; 
    setTimeout(() => {
        modalEl.classList.add('active'); 
    }, 10);
    populateRanking(); 
});

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        modalEl.classList.remove('active');
        setTimeout(() => {
            modalEl.style.display = "none";
        }, 300);
    });
});

modalEl.addEventListener('click', (event) => { 
    if (event.target === modalEl) {
        modalEl.classList.remove('active');
        setTimeout(() => {
            modalEl.style.display = 'none';
        }, 300);
    }
});

// Listener global para fechar modais com a tecla ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (modalEl.classList.contains('active')) {
            modalEl.classList.remove('active');
            setTimeout(() => {
                modalEl.style.display = 'none';
            }, 300);
        }
        if (nicknameModal.classList.contains('active')) {
            closeNicknameModal();
        }
    }
});


// --- Inicialização do Jogo ---
initGame(); 