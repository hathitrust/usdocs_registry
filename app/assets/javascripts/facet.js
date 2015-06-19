$(document).on('page:load ready', function(){
  /* show more/less facet options */
  $('.morefacets').click(function(e){
    e.preventDefault();
    var facet_name = $(this).data('facet_name');
    
    if( $(this).html().match(/more/) ) {
      $('.'+facet_name).show().css('visibility','visible');
      $(this).html('&lt;&lt;less');
    }
    else{
      $('.'+facet_name+'.hidefacet').hide().css('visibility','hidden');
      $(this).html('more&gt;&gt;');
    }
  });

  /* show the publication year options if a decade is selected */
  show_pub_dates();  

});



function show_pub_dates(){
  if( window.location.href.match(/pub_decade/) ){
    $('.pub_date').show().css('visibility','visible');
  }
}

