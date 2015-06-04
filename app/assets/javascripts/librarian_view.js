$(document).ready(function(){
  $('#librarian_viewLink').click(function(e){
    e.preventDefault();
    $('#marc_view').toggle();
    console.log('clicked');
  });
});
