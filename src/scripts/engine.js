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
let isProcessing = false;

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

init();
