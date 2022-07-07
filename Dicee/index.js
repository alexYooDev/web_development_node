const player1Dice = document.querySelector('.img1');
const player2Dice = document.querySelector('.img2');
const $title = document.querySelector('.title');

let randomNumber1 = Math.floor(Math.random() * 6 + 1);
let randomNumber2 = Math.floor(Math.random() * 6 + 1);

player1Dice.setAttribute('src', `./images/dice${randomNumber1}.png`);
player2Dice.setAttribute('src', `./images/dice${randomNumber2}.png`);

if (randomNumber1 === randomNumber2) {
  $title.textContent = 'You have a draw!';
} else if (randomNumber1 > randomNumber2) {
  $title.textContent = '🚩 Player 1 Wins!';
} else {
  $title.textContent = 'Player 2 Wins! 🚩';
}
