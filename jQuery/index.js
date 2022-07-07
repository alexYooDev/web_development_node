$('button').click(function () {
  $('h1').slideUp().slideDown().animate({
    opacity: 0.5,
  });
});

$(document).keypress(function (event) {
  $('h1').text(event.key);
});

$('h1').on('mouseover', function () {
  $('h1').css('color', 'red');
});
