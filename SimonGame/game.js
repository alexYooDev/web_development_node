let gamePattern = [];

const buttonColors = ['red', 'blue', 'green', 'yellow'];

let userClickedPattern = [];

let level = 0;

let started = false;

$(document).on('keydown', function () {
  if (started === false) {
    $('#level-title').text(`Level ${level}`);
    nextSequence();
    started = true;
  }
});

function nextSequence() {
  userClickedPattern = [];

  let randomNumber = Math.floor(Math.random() * 4);
  let randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  $(`#${randomChosenColor}`).fadeOut(75).fadeIn(75);
  playSound(randomChosenColor);

  level++;
  $('h1').text(`Level ${level}`);
}

function playSound(color) {
  const audio = new Audio(`sounds/${color}.mp3`);
  audio.play();
}

function anmiatePress(currentColor) {
  $(`.${currentColor}`).addClass('pressed');
  setTimeout(function () {
    $(`.${currentColor}`).removeClass('pressed');
  }, 50);
}

function checkAnswer(currentLevel) {
  if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
    console.log('success');

    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 1000);
    }
  } else {
    console.log('wrong');

    playSound('wrong');

    $('body').addClass('game-over');

    setTimeout(function () {
      $('body').removeClass('game-over');
    }, 200);

    $('#level-title').text('Game Over, Press Any Key to Restart!');
    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  started = false;
}

$('.btn').click(function () {
  let userChosenColor = $(this).attr('id');
  userClickedPattern.push(userChosenColor);

  playSound(userChosenColor);
  anmiatePress(userChosenColor);

  checkAnswer(userClickedPattern.length - 1);
});
