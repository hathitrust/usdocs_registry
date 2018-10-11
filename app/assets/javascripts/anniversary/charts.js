jq(document).ready(function(){
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/music_over_time_counts.csv',
                'Items Classified as Music',
                'music_growth',
                'All',
                'Music is defined as LC call numbers MT, Ml, and M.');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/portuguese_growth.csv',
                'Growth of the Portuguese Collection',
                'portuguese_growth',
                'All',
                '');
  drawColumnChart('2008-2018: Contributors to HathiTrust',
                  '/usdocs_registry/assets/tenth_anniversary/yearly_contributions_percent.csv',
                  'content_providers_percent_bar',
                  9,
                  600,
                  'vertical');
  drawColumnChart('Content Providers',
                  '/usdocs_registry/assets/tenth_anniversary/contributions_2018.csv',
                  'contribs_2018',
                  1,
                  '90%',
                  'vertical');
/*
  drawColumnChart('Languages',
                  '/usdocs_registry/assets/tenth_anniversary/languages_2018.csv',
                  'languages_2018',
                  1,
                  '90%',
                  'vertical');*/
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/lang_date.csv', 
                'Languages',
                'language',
                'All',
                '');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/languages_top_ten.csv', 
                'Top 10 Languages',
                'languages_top',
                'All',
                '');
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/pub_dates_counted.csv', 
                'Publication Dates',
                'pub_date',
                'All',
                '');
  drawPie('/usdocs_registry/assets/tenth_anniversary/music_contribs_2008.csv',
          'Music Contributors 2008',
          'music_contribs_2008');
  drawPie('/usdocs_registry/assets/tenth_anniversary/music_contribs_2018.csv',
          'Music Contributors 2018',
          'music_contribs_2018');
  drawAreaChart('/usdocs_registry/assets/stats/num_dig.csv', 
                '# of Digitized Objects',
                'num_digitized',
                'All',
                '');
  drawBarChart('horizontal',
                 '/usdocs_registry/assets/2018-10-01/contributors.tsv', 
                 'Top Ten Contributors', 
                 'Contributor',
                 'Number of Items Contributed',
                 10,
                 'contrib_chart' );

  /* Environmental Science */
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/environmental_science_over_time.csv',
                'Items Classified as Environmental Science',
                'env_science_growth',
                'All',
                'Environmental Science is defined as LC call numbers within GE.');
  drawPie('/usdocs_registry/assets/tenth_anniversary/env_science_contribs_2008.csv',
          'Environmental Science Contributors 2008',
          'env_science_contribs_2008');
  drawPie('/usdocs_registry/assets/tenth_anniversary/env_science_contribs_2018.csv',
          'Environmental Science Contributors 2018',
          'env_science_contribs_2018');
  /* Agriculture */
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/agriculture_over_time.csv',
                'Items Classified as Agriculture',
                'agriculture_growth',
                'All',
                'Agriculture is defined as LC call numbers within S, SB, SD, SF, and SH.');
  drawPie('/usdocs_registry/assets/tenth_anniversary/ag_contribs_2008.csv',
          'Agriculture Contributors 2008',
          'ag_contribs_2008');
  drawPie('/usdocs_registry/assets/tenth_anniversary/ag_contribs_2018.csv',
          'Agriculture Contributors 2018',
          'ag_contribs_2018');
  /* Classics */
  drawAreaChart('/usdocs_registry/assets/tenth_anniversary/classics_over_time.csv',
                'Items Classified as Classics',
                'classics_growth',
                'All',
                'Classics is defined as LC call numbers within DE, DF, DG, PA.');
  drawPie('/usdocs_registry/assets/tenth_anniversary/classics_contribs_2008.csv',
          'Classics Contributors 2008',
          'classics_2008');
  drawPie('/usdocs_registry/assets/tenth_anniversary/classics_contribs_2018.csv',
          'Classics Contributors 2018',
          'classics_2018');
  });


function drawPie(source_data, title, divid){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      jq.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = jq.csv.toArrays(csvString, {onParseValue: jq.csv.hooks.castToScalar});
        var data = new google.visualization.arrayToDataTable(arrayData);
        var options = { title: title }
        var chart = new google.visualization.PieChart(document.getElementById(divid));
        chart.draw(data, options);
      });
    }
}

 
function drawColumnChart(title, source_data, divid, gridlines, height, orientation){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      jq.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = jq.csv.toArrays(csvString, {onParseValue: jq.csv.hooks.castToScalar});
        var header = arrayData[0]
        var formatter = new google.visualization.NumberFormat({pattern: '0'});
        var data = new google.visualization.arrayToDataTable(arrayData);
        header[0] = {label: 'Year', id: 'year', format: '0'}
        data[0] = header
        formatter.format(data, 0);      
        var options = {
          title: title,
          titleTextStyle: {
            fontSize: 18
          },
          tooltip: {isHtml: true},
          width: "80%",
          height: height,
          /* chartArea: {left: 100}, */
          
          bar: {groupWidth: "100%"},
          legend: { position: "none" },
          isStacked: 'percent',
          bars: orientation,
          vAxis: { title: '', format: '', textPosition: 'none' },
          hAxis: { gridlines: {count: gridlines}, title: '', format: '0' }
        };
        var chart = new google.visualization.ColumnChart(document.getElementById(divid));
        chart.draw(data, options);
      })
    }
}

function drawAreaChart(source_data, title, divid, sclass, bottom_text){
  sclass = sclass || 'Top 10'
  google.charts.load('current', {'packages':['corechart', 'line']});
  google.charts.setOnLoadCallback(function(){
    jq.get(source_data, function(csvString) {
        /*google.charts.load('current', {'packages':['corechart', 'area']});*/
        var arrayData = jq.csv.toArrays(csvString, {onParseValue: jq.csv.hooks.castToScalar});
        var header = arrayData[0]
        var formatter = new google.visualization.NumberFormat({pattern: '0'});
        /* don't need Month */
        month = header.shift
        var data = new google.visualization.arrayToDataTable(arrayData);
        formatter.format(data, 0);      
         
        var options = {
          title: title,
          width:"80%",
          height:600,
          isStacked:true,
          hAxis: { gridlines: {count: 10},
                   format: '0',
                   title: bottom_text }

        };
        console.log(bottom_text); 
        var chart = new google.visualization.AreaChart(document.getElementById(divid));
        //use a DataView to filter 
        if( sclass != 'All' && divid == 'languages_top') {
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

function getData(source_data){
  return jq.ajax({
            url: "/usdocs_registry/assets/2018-10-01/"+source_data,
            dataType: "json",
            async: false
          }).responseText;
}

function drawBarChart(bar_orientation, source_data, title, first_column, second_column, top_num, divid) {
  google.charts.load("current", {packages:["bar"]});
  google.charts.setOnLoadCallback(function(){
    jq.get(source_data, function(tsvString) {
      var dt = new google.visualization.DataTable();
      dt.addColumn('string', first_column);
      dt.addColumn('number', second_column);
      var other_count = 0
      var other_total = 0
      tsvString.split("\n").forEach(function(line, index){
        if( line == ''  ){ return; }

        row = line.split("\t");
        if( index < top_num ){
          dt.addRows([
            [row[0], parseInt(row[1])]
          ]);
        }
        else {
          other_count += 1;
          other_total = other_total + parseInt(row[1])
        }
      });
      if( other_total > 0 ){
        dt.addRows([
          ['Others ('+other_count+')', other_total]
        ]);
      }

      // Set chart options
      var options = {
        chart: {
          title:title,
          height:600
        },
        axes: {
                y: { all: { format: { pattern: 'decimal' } } },
                x: { all: { format: { pattern: 'decimal' } } }
              },
        legend: {position: 'none'},
        chartArea: {width:"50%"},
        bars: bar_orientation 
      };
      var chart;
      chart = new google.charts.Bar(document.getElementById(divid));    
      chart.draw(dt, google.charts.Bar.convertOptions(options));
    });
  });
}
