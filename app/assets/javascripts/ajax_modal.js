/* We don't actually want modals, so we'll use this to clobber Blacklight's implementation */

$(document).ready(function(){
  /* still have modal html strewn about. use it if it makes sense*/
  $('.ajax-modal-close').click(function(e){
    e.preventDefault();
    $(this).closest('.tool_view').hide();
  });

  /* tool bar links to toggle divs in main document sect. */
  $('#emailLink, #smsLink, #citationLink, #librarian_viewLink').click(function(e){
    e.preventDefault();
    var name = $(this).attr('id').replace('Link','');
    if (!name.match(/view/)){ name = name+'_view'; }
    var link = $(this).attr('href');
    $('#'+name).toggle();
    
  });

  /* simplified modalAjaxFormSubmit */
  $('.ajax_form').submit(function(e){
    e.preventDefault();
    $(this).siblings('.ajax-form-success').html('Sending...');
    $.ajax({
      url: $(this).attr('action'),
      data: $(this).serialize(),
      type: $(this).attr('method'), 
      dataType: 'script',
      success: function() { 
        console.log('this happened');
        $(this).siblings('.ajax-form-success').html('Your message has been sent.');
      }
    });
  });

  /* handling the feedback form. 
     Very similar to modals, but easier to handle separately. */ 
  $('#feedback_submit').click( function(e) {
    e.preventDefault();
    /* do this first, so they don't keep hitting the submit button */
    $('#feedback_submit').hide();
    $('#feedback-success').html('Sending...');
    $.ajax({
      type: "POST",
      url: '<%= root_path %>feedback', 
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data: {
        current_url: window.location.href, 
        comments: $('#comments').val(), 
        email: $('#email').val()
      },
      success: function() {
        $('#comments').val('');
        $('#feedback-success').html('Your feedback has been received. Thank you.');
        $('#feedback_submit').show();
      }
    });
  });
  
});
