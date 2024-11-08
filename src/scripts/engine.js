const emojis = [
  "🐸",
  "🐸",
  "🐔",
  "🐔",
  "🐱‍💻",
  "🐱‍💻",
  "🐶",
  "🐶",
  "🐷",
  "🐷",
  "🐵",
  "🐵",
  "🐱‍👤",
  "🐱‍👤",
  "🐱‍🐉",
  "🐱‍🐉",
];

let openCards = [];

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
  // Verifica se o tamanho do array de openCards é menor que 2, caso seja, adiciona a carta clicada ao array de openCards
  if (openCards.length < 2) {
    openCards.push(this);
    openCards[0].classList.add("open");
    openCards[1].classList.add("open");
  }
  if (openCards.length === 2) {
    /* Verifica se o array de openCards tem dois elementos */
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
      /* Verifica se as cartas clicadas sao iguais */
      openCards[0].classList.add("match");
      openCards[1].classList.add("match");
      openCards[0].classList.add("open");
      openCards[1].classList.add("open");
      openCards = [];
    } else {
      setTimeout(() => {
        openCards[0].classList.remove("open");
        openCards[1].classList.remove("open");
        openCards = [];
      }, 1000);
    }
  }
}
function init() {
  addCards();
}

init();
