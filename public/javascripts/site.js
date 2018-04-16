// javascripts for client viewing

function refine_search() {
  //refine_search button
  $(document).on('click','#btn_refine', function() {
    var refine_results = $('#refine_results').val();

    if (refine_results.length) {
      $('li.word').children('p').each(function() {
        if ($(this).text().includes(refine_results.toLowerCase())) {
          // li heading contains our result
          $(this).closest('li.word').show();
        } else {
          $(this).closest('li.word').hide();
        }
      });
    } else {
      $('#refine_results').css({ "border": '#FF0000 1px solid'});
    }
  });

  // handle when enter is pressed in text box
  $(document).on('keyup', '#refine_results', function(e) {
    if(e.keyCode == 13) {
        $('#btn_refine').click();
    }
  });

  // refine_clear button
  $(document).on('click','#btn_refine_clear', function() {
    $('#refine_results').val('');
    $('.word').show();
  });
}

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
  refine_search();
});
