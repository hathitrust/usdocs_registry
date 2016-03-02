/* Blacklight likes to POST to track when it should just GET. 
   This overrides blacklight-5.18.0/app/assets/javascripts/blacklight/search_context.js
*/

$(document).ready(function(){
  $('a[data-context-href]').off();
});
