$(document).ready(function(){

  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/yearly_contributions.csv', 
                'Content Providers',
                'content_providers');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/music_over_time_counts.csv',
                'Items Classified as Music',
                'music_growth');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/portuguese_growth.csv',
                'Growth of the Portuguese Collection',
                'portuguese_growth');
  drawColumnChart('% of Corpus',
                  '/usdocs_registry/assets/tenth_anniversary/yearly_contributions_percent.csv',
                  'content_providers_percent_bar',
                  9,
                  600);
  drawColumnChart('Content Providers',
                  '/usdocs_registry/assets/tenth_anniversary/contributions_2018.csv',
                  'contribs_2018',
                  1,
                  '90%');
  drawColumnChart('Languages',
                  '/usdocs_registry/assets/tenth_anniversary/languages_2018.csv',
                  'languages_2018',
                  1,
                  '90%');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/lang_date.csv', 
                'Languages',
                'language');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/pub_dates_counted.csv', 
                'Publication Dates',
                'pub_date');
  drawPie('/usdocs_registry/assets/tenth_anniversary/music_contribs_2008.csv',
          'Music Contributors 2008',
          'music_contribs_2008');
  drawPie('/usdocs_registry/assets/tenth_anniversary/music_contribs_2018.csv',
          'Music Contributors 2018',
          'music_contribs_2018');
  drawTreeMap('/usdocs_registry/assets/tenth_anniversary/classification_counts.csv',
              '',
              'classifications');

  });
});

function drawTreeMap(source_data, title, divid){
    google.charts.load("current", {packages:["treemap"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var data = new google.visualization.arrayToDataTable(arrayData);
        var options = { title: title,
                        generateTooltip: function(row,size,value){ return size;}
                       }
        var chart = new google.visualization.TreeMap(document.getElementById(divid));
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

 
function drawColumnChart(title, source_data, divid, gridlines, height){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      $.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        var header = arrayData[0]
        var data = new google.visualization.arrayToDataTable(arrayData);
        header[0] = {label: 'Year', id: 'year', format: '0'}
        data[0] = header
        var options = {
          title: title,
          width: "80%",
          height: height,
          /* chartArea: {left: 100}, */
          
          bar: {groupWidth: "100%"},
          legend: { position: "none" },
          isStacked: 'percent',
          bars: 'vertical',
          vAxis: { title: '', format: '', textPosition: 'none' },
          hAxis: { gridlines: {count: gridlines}, title: '', format: '0' }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(divid));
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
          hAxis: { gridlines: {count: 10}, format: '0' }

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
 
