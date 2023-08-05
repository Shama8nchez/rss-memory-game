const newGame = document.querySelector('.newgame-btn');
const cards = document.querySelectorAll('.card');
const currentScore = document.querySelector('.current-score');
const lastTen = document.querySelector('.last-ten');

function startGame() {
  let isCurrentGame = true;
  if (!localStorage.getItem('resultsKey')) {
    localStorage.setItem('resultsKey', '[]');
  }
  let resultsArr = JSON.parse(localStorage.getItem('resultsKey'))
  let results = '';
  for (let i = 0; i < resultsArr.length; i++) {
    results = results + (i+1) + '. ' + resultsArr[i] + '<br>';
  }
  lastTen.innerHTML = 'Last Ten Scores: <br><br>' + results;

  cards.forEach(card => card.classList.remove('flip'));
  let hasFlippedCard, firstCard, secondCard, lockCards;
  const resetState = () => {
    hasFlippedCard = false;
    firstCard = null;
    secondCard = null;
    lockCards = false;
  }
  resetState();

  let count = 0;
  let win = 0;
  currentScore.innerHTML = `Current Score: ${count}`;
  
  function shuffleCards() {
    cards.forEach(card => card.style.order = Math.floor(Math.random()*20));
  }
  
  shuffleCards();
  
  function flipCard() {
    if (isCurrentGame) {
      if (lockCards || this === firstCard) {
        return;
      }
      this.classList.add('flip');
      count++;
      currentScore.innerHTML = `Current Score: ${count}`;
    
      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
      secondCard = this;
      lockCards = true;
    
      if (firstCard.dataset.club === secondCard.dataset.club) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetState();
        win++;
        if (win === 10) {
          currentScore.innerHTML = `Your Score: ${count}`;
          resultsArr.unshift(count);
          if (resultsArr.length == 11) {
            resultsArr.pop();
          }
          results = '';
          for (let i = 0; i < resultsArr.length; i++) {
            results = results + (i+1) + '. ' + resultsArr[i] + '<br>';
          }
          lastTen.innerHTML = 'Last Ten Scores: <br><br>' + results;
          localStorage.setItem('resultsKey', JSON.stringify(resultsArr));
          resetState();
        }
      }
    
      else {
        setTimeout(() => {
          firstCard.classList.remove('flip');
          secondCard.classList.remove('flip');
          resetState();
        }, 700);
      }
    }  
  }
  
  cards.forEach(card => card.addEventListener('click', flipCard));
  newGame.addEventListener('click', () => {
    resetState();
    isCurrentGame = false;
  });
}

startGame();

newGame.addEventListener('click', () => {
  cards.forEach(card => card.classList.remove('flip'));
  setTimeout(() => {
    startGame();
  }, 700);
})