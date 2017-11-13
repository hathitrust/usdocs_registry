var report_date = ''
var sudoc_class = 'All'
var year_stems;
var sudoc_stems;
var year_sclasses;
var sudoc_classes;

$(document).ready(function(){
  $('#report_picker').change(function(){
    report_date = $('#report_picker').val();
    $('#report_date').html(report_date.toLocaleString());
    
    //need to get the year_sudoc data here so we don't have to refetch when we redraw
    getYearSudocData();
     
    //add class options to the sudoc_filter
    $('#sudoc_filter').find('option').remove().end().append('<option selected value="All">All SuDocs</option>');
    sudoc_classes.slice(1).forEach(function(sclass, index){
      $('#sudoc_filter').append('<option>'+sclass+'</option>');
    });
    
    addCharts();
    addSummaryData();
  });

  $('#sudoc_filter').change(function(){
    sudoc_class = $('#sudoc_filter').val();
    drawSudocYearChart(sudoc_class);
  });
  
  report_date = $('#report_picker').val();  
  $('#report_date').html(report_date.toLocaleString());
  addSummaryData();

  //need to get the year_sudoc data here so we don't have to refetch when we redraw
  getYearSudocData();
 
  //add class options to the sudoc_filter
  sudoc_classes.slice(1).forEach(function(sclass, index){
    $('#sudoc_filter').append('<option>'+sclass+'</option>');
  });

  addCharts();
});

function getYearSudocData(){
  /* fetch the year_sudoc class/stem data. Prep for display. */
  year_sclasses = getData('year_sudocclasses.tsv').trim().split("\n")
  sudoc_classes = year_sclasses.shift().split("\t");
  year_stems = getData('year_sudocstems.tsv').trim().split("\n")
  sudoc_stems= year_stems.shift().split("\t");
} 

function addSummaryData(){
  var summary = JSON.parse(getData('summary.json'));
  $('.num_bib_records').html(summary['num_bib_records'].toLocaleString());
  $('#num_digital_objects').html(summary['num_digital_objects'].toLocaleString());
  $('#num_monographs').html(summary['num_monographs'].toLocaleString());
  $('#num_serials').html(summary['num_serials'].toLocaleString());
  $('.corpus_size').html(summary['corpus_size'].toLocaleString());
  $('#corpus_percent').html(summary['corpus_percent'].toFixed(2));
  $('.num_unique_items').html(summary['num_unique_items'].toLocaleString());
  $('#rpt_run_date').html(summary['rpt_run_date'].toLocaleString());
  $('.num_missing_language').html(summary['num_missing_language'].toLocaleString());
  $('.num_missing_pubdate').html(summary['num_missing_pubdate'].toLocaleString());
  $('.num_missing_sudoc').html(summary['num_missing_sudoc'].toLocaleString());
  $('.num_missing_holding_pubdate').html(summary['num_missing_holding_pubdate'].toLocaleString());
  if( summary['num_rights'] ){
    $('.num_rights').html(summary['num_rights'].toLocaleString());
  }else{ $('.num_rights').html('eighteen (18)'); }
  
}
   

function addCharts(){
  google.charts.load('current', {'packages':['corechart', 'line', 'bar', 'treemap', 'table']});
  //google.charts.load('current', {'packages':['line']});
  //google.charts.load('current', {'packages':['bar']});
  google.charts.setOnLoadCallback(function(){
    drawBarChart('horizontal',
                 'contributors.tsv', 
                 'Top Ten Contributors', 
                 'Contributor',
                 'Number of Items Contributed',
                 10,
                 'contrib_chart' );
    drawBarChart('horizontal',
                 'digitizing.tsv', 
                 'Top Three Digitizing Agents', 
                 'Digitizing Agent',
                 'Number of Items Digitized',
                  3,
                 'digitizing_chart' );
    drawBarChart('horizontal',
                 'rights.tsv', 
                 'Top Five Rights Determinations', 
                 'Rights Determination',
                 'Number of Items',
                  5,
                 'rights_chart' );
   
    /*drawChart('monodupes.tsv',
                 'Monographs with multiple digital objects',
                 '# of duplicate objects',
                 '# of occurences',
                 5,
                'monodupes_chart');
    drawBarChart('vertical',
                 'monodupes.tsv',
                 'Duplication of Monographs',
                 '# of Copies',
                 '# of Occurences',
                 4,
                 'monodupes_chart');*/
    //drawMonoDupesChart();
    drawBarChart('horizontal',
                 'sudocstems.tsv',
                 'SuDoc Numbers',
                 'Sudoc Number',
                 '# of occurences',
                 20,
                 'sudocstem_chart');
    drawTable('languages.tsv', ['Language','# of Bib Records'], 'languages_table');
    drawTable('sudocstems.tsv', ['SuDoc Class', '# of Bib Records', 'Author'], 'sudoc_table');
    drawTable('comprehensiveness.tsv', ['Series', '# Items in HT', '# Items in Registry', '% Comprehensiveness'], 'comprehensiveness_table');


  });
  
  google.charts.setOnLoadCallback(function(){
    drawSudocYearChart(sudoc_class);
    drawLineChart('yearpub.tsv',
                  'Publication Year',
                  'Year',
                  '# of Holdings');
    /*drawTree();*/
  });
}

function drawSudocYearChart(sclass){
  var sudoc_data;
  var header;
  if(sclass == 'All'){
    //only draw the basic classes
    sudoc_data = year_sclasses; 
    header = sudoc_classes;
  }
  else{
    sudoc_data = year_stems;
    header = sudoc_stems;
  }
  //var header = //sudoc_data.shift().split("\t");
  var data = new google.visualization.DataTable();
  for( var i=0, len = header.length; i < len; i++) {
    if( i == 0 ){
      data.addColumn('string', header[i]);
    }else{
       data.addColumn('number', header[i]);
    }
  }
  data.addRows(sudoc_data.map(function(line){
      return line.split("\t").map(function(val, index){
        if(index == 0){return val;}else{return parseInt(val);}
      });
    })
  );

  var options = {
    title:'SuDoc Assignment Over Time',
    width:"80%",
    height:500 
  };
  var chart = new google.visualization.LineChart(document.getElementById('yearsudocs_chart'));

  //use a DataView to filter 
  if( sclass != 'All') {
    var view = new google.visualization.DataView(data);
   
    //only the columns that match the selected class 
    view.setColumns([0].concat(header.filter(function(stem, index){
          if( stem.split(' ')[0] == sclass ){
            return index;
          }
        })
      )//concat
    );
    chart.draw(view, options);
  }else{
    chart.draw(data, options);
  }
  
} 

function drawMonoDupesChart() {
  var tsv = getData('monodupes.tsv');
  var dt = new google.visualization.DataTable();
  dt.addColumn('string', '# of Copies');
  dt.addColumn('number', '# of occurences');
  var other_total = 0
  tsv.split("\n").forEach(function(line, index){
    if( line == ''  ){ return; }

    row = line.split("\t");
    if( index < 4 ){
      dt.addRows([
        [row[0], parseInt(row[1])]
      ]);
    }
    else {
      other_total = other_total + parseInt(row[1])
    }
  });
  if( other_total > 0 ){
    dt.addRows([
      ['More than 4', other_total]
    ]);
  }

  var options = {'title':'Duplication of Monographs',
                 'width':600,
                 'height':400,
                 'colors':['#d56d11']};
  var chart = new google.visualization.ColumnChart(document.getElementById('monodupes_chart'));
  chart.draw(dt, options);
}




function drawBarChart(bar_orientation, source_data, title, first_column, second_column, top_num, divid) {
  //contributor data
  var tsv = getData(source_data);    // Create the data table.
  var dt = new google.visualization.DataTable();
  dt.addColumn('string', first_column);
  dt.addColumn('number', second_column);
  var other_count = 0
  var other_total = 0
  tsv.split("\n").forEach(function(line, index){
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
      title:title
    },
    axes: {
            y: {
                all: {
                    format: {
                        pattern: 'decimal'
                    }
                }
            },
            x: {
                all: {
                    format: {
                        pattern: 'decimal'
                    }
                }
            }
          },
    legend: {position: 'none'},
    chartArea: {width:"50%"},
    bars: bar_orientation 
  };
  var chart;
  //if( bar_orientation == 'horizontal' ){ 
    //chart = new google.visualization.BarChart(document.getElementById(divid));
    chart = new google.charts.Bar(document.getElementById(divid));
  //}else{
   // chart = new google.visualization.ColumnChart(document.getElementById(divid));
  //}
    
  chart.draw(dt, options);
}

function drawLineChart(source_data, title, x, ys){
  var tsv = getData('yearpub.tsv').split("\n");
  for ( var i=0; i<tsv.length; i++){
    row = tsv[i].split("\t");
    tsv[i] = [row[0], parseInt(row[1])];
  }
  tsv.unshift(['Year', 'Number of Publications']);
  var data = google.visualization.arrayToDataTable(tsv);
  var chart = new google.visualization.LineChart(document.getElementById('pubdates_chart'));
  var options = {
    title: 'Publications per Year'
  };
  chart.draw(data, options)
}

function getData(source_data){
  return $.ajax({
            url: "assets/"+report_date+"/"+source_data,
            dataType: "json",
            async: false
          }).responseText;
}

function drawTree(){
  var tsv = getData('sudoctree.tsv').split("\n");
  for( var i=0; i<tsv.length; i++){
    row = tsv[i].split("\t");
    tsv[i] = [row[0], row[1], parseInt(row[2]), parseInt(row[2])];
  }
  tsv.unshift(['SuDocs', null, 0, 0]);
  tsv.unshift(['SuDoc', 'Parent', 'Num', 'Numb']);
  var data = google.visualization.arrayToDataTable(tsv);
  var chart = new google.visualization.TreeMap(document.getElementById('sudoctree_chart'));
  var options = {
    chart: {'title': 'SuDoc Classifications'},
    'width':900,
    'height':600
  };
  chart.draw(data);//, options)
}

function drawTable(source_data, columns, div_id){
  var tsv = getData(source_data).trim().split("\n");
  var data = new google.visualization.DataTable();
  data.addColumn('string', columns[0]);
  for( var i=1; i < columns.length; i++){
    if( source_data == 'sudocstems.tsv' && i == 2 ){ data.addColumn('string', columns[i]);}
    else{ data.addColumn('number', columns[i]);}
  }
  for( var i=0; i<tsv.length; i++){
    row = tsv[i].split("\t");
    if(source_data == 'sudocstems.tsv'){
      tsv[i] = row.slice(1,2).map(Number);
      tsv[i].push(row[2]);
    }else{
      tsv[i] = row.slice(1).map(Number);
    }
    tsv[i].unshift(row[0]);
  }
  data.addRows(tsv);
  var options = {
    showRowNumber: true,
    height: 300,
    width: '80%'
  };
  var table = new google.visualization.Table(document.getElementById(div_id));
  table.draw(data, options);
}
  


