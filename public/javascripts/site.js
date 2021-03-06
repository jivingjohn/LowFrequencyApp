// javascripts for client viewing
function click_on_word() {
  // Show the user they can click
  $('.word').css('cursor', 'pointer');
  // Toggle the ul visibility of any child of this li
  $(document).on('click', '.word', function() {
      $(this).children('ul').each(function() {
        $(this).toggle();
      });
  });
}

function hide_no_matches() {
  $(document).on('click', '.btn-toggle-no-match', function() {
    var html = $(this).html();
    // change the text on the button

    var show = html.replace('Hide','Show');
    var hide = html.replace('Show','Hide');

    if (show == html) {
      $(this).html(hide);
    } else {
      $(this).html(show);
    }

    $('li:contains("(0)")').each(function() {
      $(this).toggle();
    });
  });
}

$(document).ready( function() {
  click_on_word();
  hide_no_matches();
});
