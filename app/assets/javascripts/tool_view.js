$(document).ready(function(){
  $('#emailLink, #smsLink, #citationLink').click(function(e){
    e.preventDefault();
    var name = $(this).attr('id').replace('Link','');
    var link = $(this).attr('href');
    $('#'+name+'_view').toggle();
    
  });
});
