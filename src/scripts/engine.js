// -- DOM --
const timerEl = document.getElementById("timer");
const openRankButton = document.getElementById("openRankingSvg");
const modalEl = document.querySelector(".modal");
const closeButtons = document.querySelectorAll(
  ".close-button, .x-close-button"
);
const skipButton = document.querySelector(".skip-btn");
const confirmButton = document.querySelector(".confirm-btn");
const rankingList = document.getElementById("rankingList");
const nicknameContainer = document.querySelector(".nickname-container");
const nicknameInput = document.getElementById("nicknameInput");

// -- Var and Const
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
let openCards = [];
const totalMatchesToWin = emojis.length / 2;
let totalMilliseconds = 0;
let totalMatches = 0; // Sempre 0, se tiver outro número é porque eu estava testando;
let timerInterval;
let nickname;

// -- States --
let isProcessing = false;
let isStarted = false;
let isFinished = false;

function addCards() {
  let shuffleEmojis = emojis.sort(() => Math.random() - 0.5);

  emojis.forEach((_, i) => {
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
  }

  if (
    // Verificando se contém alguma carta aberta, caso contenha ele não faz nada e retorna a func.
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

// --- Timer Functions ---

function startTimer() {
  isStarted = true;
  totalMilliseconds = 0;

  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    totalMilliseconds += 10;
    timerEl.textContent = formatTime(totalMilliseconds);
  }, 10);
}

function stopTimer() {
  clearInterval(timerInterval);
  isStarted = false;
  isFinished = true;
  timerEl.textContent = "00:00"
  displayNicknameModal();
}

// Verifica o total de matches para poder parar o jogo.
function matchesCount() {
  totalMatches++;

  if (totalMatches === totalMatchesToWin) {
    stopTimer();
  }
}

// --- Ranking Functions ---
function rankingData(nicknameWrited) {
  // Salva os dados do jogador no Firebase
  const rankingRef = db.collection("jogadores");
  const playerData = {
    nick: `${nicknameWrited ? nicknameWrited : idGenerator(nickname)}`,
    time: `${formatTime(totalMilliseconds)}`,
    totalMilliseconds: totalMilliseconds,
  };
  rankingRef
    .add(playerData)
    .then(() => {
      console.log("Documento salvo com sucesso!");
      displayRanking();
    })
    .catch((error) => {
      console.error("Erro ao salvar o documento: ", error);
      displayRanking();
    });
}

// Função displayRanking que busca os dados do Firebase
function displayRanking() {
  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";
  const loadingMessage = document.createElement("li");
  loadingMessage.innerText = "Carregando ranking...";
  loadingMessage.style.textAlign = "center";
  rankingList.appendChild(loadingMessage);

  db.collection("jogadores").orderBy("totalMilliseconds", "asc").limit(50).get()
    .then((querySnapshot) => {
      rankingList.innerHTML = "";

      if (querySnapshot.empty) {
        const noDataMessage = document.createElement("li");
        noDataMessage.innerText = "Não há registros. Seja o primeiro!";
        noDataMessage.classList.add('no-data-message');
        rankingList.appendChild(noDataMessage);
        return;
      }

      // Cria um contador para o ranking
      let rank = 1;
      
      querySnapshot.forEach((doc) => {
        const p = doc.data();
        const DataMessage = document.createElement("li");
        DataMessage.innerHTML = `
          <div class="ranking-item">
              <span class="ranking-position">${rank}º</span>
              <div class="player-details">
                  <span class="player-name"><strong>Player</strong>: ${p.nick.trim() || 'Anônimo'}</span>
                  <span class="player-time"><strong>Tempo</strong>: ${p.time || '--:--'}</span>
              </div>
          </div>
        `;
        rankingList.appendChild(DataMessage);
        // Incrementa o contador a cada iteração
        rank++;
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar documentos: ", error);
      rankingList.innerHTML = "";
      const errorMessage = document.createElement("li");
      errorMessage.innerText = "Erro ao carregar o ranking.";
      rankingList.appendChild(errorMessage);
    });
}

// --- Nickname Functions ---
function displayNicknameModal() {
  const displayFinalTime = document.getElementById("displayFinalTime");
  if (isFinished) {
    displayFinalTime.innerText = timerEl.innerText;
    nicknameContainer.style.display = "flex";
  }
}

// --- Event Listeners ---
openRankButton.addEventListener("click", () => {
  modalEl.style.display = "flex";
  displayRanking();
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modalEl.style.display = "none";
  });
});

skipButton.addEventListener("click", () => {
  rankingData(false);
  nicknameContainer.style.display = "none";
});

confirmButton.addEventListener("click", () => {
  rankingData(nicknameInput.value);
  nicknameContainer.style.display = "none";
});

// Utility Functions
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

function formatTime(totalMilliseconds) {
  const minutes = Math.floor(totalMilliseconds / 600000);
  const seconds = Math.floor((totalMilliseconds / 1000) % 60);
  const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}:${String(centiseconds).padStart(2, "0")}`;
}

// --- Iniciando o jogo ---
function init() {
  addCards();
}

// --- Resetando o jogo ---
function reset() {
  isFinished = false;
  totalMatches = 0; // Precisa mudar para 0
  document.querySelector(".game").innerHTML = "";
  clearInterval(timerInterval)
  timerEl.textContent = "00:00"
  addCards();
}

init();
