$(document).ready(function(){

  drawAreaChart('data/num_dig.csv', 
                '# of Digitized Objects',
                'num_digitized');
  drawAreaChart('data/num_bibs.csv', 
                'Bibliographic Records',
                'num_bibs');
  drawAreaChart('assets/tenth_anniversary/yearly_contributions.csv', 
                'Content Providers',
                'content_providers');
  drawAreaChart('assets/tenth_anniversary/music_over_time_counts.csv',
                'Items Classified as Music',
                'music_growth');
  drawAreaChart('assets/tenth_anniversary/yearly_contributions_percent.csv', 
                'Content Providers % of Corpus',
                'content_providers_percent');
  drawColumnChart('assets/tenth_anniversary/yearly_contributions_percent.csv');
  drawAreaChart('assets/tenth_anniversary/lang_date.csv', 
                'Languages',
                'language');
  drawAreaChart('assets/stats/num_sudocs.csv', 
                'SuDoc Class',
                'num_sudocs');
  drawAreaChart('assets/tenth_anniversary/pub_dates_counted.csv', 
                'Publication Dates',
                'pub_date');
  drawPie('assets/tenth_anniversary/music_contribs_2008.csv',
          'Music Contributors 2008',
          'music_contribs_2008');
  drawPie('assets/tenth_anniversary/music_contribs_2018.csv',
          'Music Contributors 2018',
          'music_contribs_2018');
  drawTreeMap('assets/tenth_anniversary/classifications.csv',
              'Library of Congress Classifications',
              'classifications');
  

  /* Fill in the select */
  $.get('assets/stats/sudoc_classes.csv', function(csvString){
    var sudoc_classes = csvString.split(',')
    sudoc_classes.forEach(function(sclass, index){
      $('#sudoc_filter').append('<option>'+sclass+'</option>');
    });
  });
    
  $('#sudoc_filter').change(function(){
    sudoc_class = $('#sudoc_filter').val();
    drawAreaChart('assets/stats/num_sudocs.csv', 
                  'SuDoc Class',
                  'num_sudocs',
                  sudoc_class);
  });
});

function drawTreeMap(source_data, title, divid){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var data = new google.visualization.arrayToDataTable(arrayData);
        var options = { title: title }
        var chart = new google.visualization.PieChart(document.getElementById(divid));
        chart.draw(data, options);
      });
    }
}



function drawPie(source_data, title, divid){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var data = new google.visualization.arrayToDataTable(arrayData);
        var options = { title: title }
        var chart = new google.visualization.PieChart(document.getElementById(divid));
        chart.draw(data, options);
      });
    }
}

 
function drawColumnChart(source_data){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var header = arrayData[0]
        var data = new google.visualization.arrayToDataTable(arrayData);
        header[0] = {label: 'Year', id: 'year', format: ''}
        data[0] = header
        console.log(data)
        var options = {
          title: "% of corpus",
          width: "80%",
          height: 600,
          bar: {groupWidth: "95%"},
          legend: { position: "none" },
          isStacked: true,
          bars: 'vertical',
          hAxis: { gridlines: {count: 9}, format: '' }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("content_providers_percent_bar"));
        chart.draw(data, options);
      })
    }
}

function drawAreaChart(source_data, title, divid, sclass){
  sclass = sclass || 'Top 10'
  google.charts.load('current', {'packages':['corechart', 'line']});
  google.charts.setOnLoadCallback(function(){
    $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var header = arrayData[0]
        /* don't need Month */
        month = header.shift
        var data = new google.visualization.arrayToDataTable(arrayData);
         
        var options = {
          title: title,
          width:"80%",
          height:600,
          isStacked:true,
          hAxis: { gridlines: {count: 10}, format: '' }

        }; 
        var chart = new google.visualization.AreaChart(document.getElementById(divid));
        //use a DataView to filter 
        if( sclass != 'All' && divid == 'num_sudocs') {
          var view = new google.visualization.DataView(data);
        
          if( sclass == 'Top 10' ){
            view.setColumns([0,1,2,3,4,5,6,7,8,9,10])
          }else{          
            //only the columns that match the selected class 
            view.setColumns([0].concat(header.filter(function(h, index){
                  if( h == sclass ){
                    return index;
                  }
                })
              )//concat
            );
          }
          chart.draw(view, options);
        }else{
          chart.draw(data, options);
        }
    });
  });
}
 
