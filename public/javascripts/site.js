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

$(document).ready( function() {
  click_on_word();
});