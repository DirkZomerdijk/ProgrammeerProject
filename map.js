var pieData
var mapData
var plotData

var province
var crime = 'Totaal'
var year = '3'
var total

var provinces = ['Groningen','Friesland','Gelderland','Drenthe','Overijssel','Flevoland','Utrecht','Noord-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg']
var years = ['2010','2011','2012','2013']
var colors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
var crimes = []

var container = d3.select('body').append('div')
	.attr('id','container');

d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	
	document.getElementById('container').appendChild(xml.documentElement)
		.setAttribute('id', 'map');

	d3.select('g').attr('transform','scale(0.8)')	

	d3.json('data/dataCrimi.json', function(error, data) {
		if (error) throw error;

		var defaultTotal = 0
		for (var i = 0; i < provinces.length; i++) {
			defaultTotal += +data[String(provinces[i])].Totaal[year]
		};
		total = defaultTotal

		for (var k in data.Groningen) crimes.push(k);

		console.log(crimes.sort());

		var crimeDropEntries = []	
		for ( var i = 0; i < crimes.length; i++ ) {
			document.getElementById('crimeDrop').innerHTML += "<a href='#' value=" + crimes[i] + " onclick='myFunction'>"+crimes[i]+"</a>"
		}
		
		fillMap(data)
		makePie(data)

	})
})


function makePie(data) {
	
	var pieData = dataPie(data, crime, year)	
	var width = 200;
	var height = 200;
	var radius = Math.min(width, height) / 2;
	var donutWidth = 50;

	var pieColors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']

	var color = d3.scale.ordinal()
		.range(pieColors)
		.domain('Groningen','Friesland','Drenthe','Overijssel','Flevoland','Utrecht','Noor-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg')

	var arc = d3.svg.arc()
		.outerRadius(radius)
		.innerRadius(radius - donutWidth)

	var labelArc

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.count});

	var pieChart = d3.select('#container').append("svg")
		.attr("id", "pie")
	    .attr("width", width)
	    .attr("height", height + 130)
	  .append("g")
	    .attr("transform", "translate(" + width /2 + "," + height/2 + ")");
	
	var g = pieChart.selectAll(".arc")
		.data(pie(pieData))
	  .enter().append("g")
		.attr("class", "arc");

	g.append("path")
	  	.attr("d", arc)
	  	.style("fill", function(d) { return color(d.data.label); });
};
function dataPie(data, crime, year) {
	var pieData = []
	for (var i = 0; i < provinces.length; i++) {

		var curLabel = provinces[i]
		var curCount = data[provinces[i]][crime][year]
		var obj = {'label': curLabel, 'count': curCount}
		pieData.push(obj)


	};
	return pieData
}

function makePlot(data) {

	//Width and height
	var margin = {top: 20, right: 20, bottom: 30, left: 40};           
	var width = 600 - margin.left - margin.right;
	var height= 500-margin.top -margin.bottom;
	var w = 600;
	var h = 500;


	var xScale = d3.scale.ordinal()
	    .domain(years)
	    .rangePoints([0, width], 0.5);

	var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(height - margin.bottom);

	var yScale = d3.scale.linear()
	    .domain([0, d3.max(data, function(d) {return d.Value; })])
	    .range([h - margin.top, margin.bottom]);


	//Create SVG element
	var svg = d3.select("body")
	    .append("svg")
	    .attr("width", w)
	    .attr("height", h);


	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	    .call(xAxis);

	var supplierData = d3.nest().key(function(d) { return d.Supplier; }).entries(data); 

	var line = d3.svg.line()
	                  .interpolate("linear")
	                  .x(function (d) { return xScale(d.Half); })
	                  .y(function (d) { return yScale(d.Value); });

	var colors = d3.scale.category10();

	var gLines = svg.selectAll('g.chart-area').data([ supplierData ]);

	gLines.enter()
	  .append('g')
	  .classed('chart-area', true)
	  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ")");

	var lines = gLines.selectAll('path.supplier').data(function (d) { return d; });

	lines.enter()
	  .append('path')
	  .classed('supplier', true)
	  .attr('d', function (d) { return line(d.values); })
	  .attr('fill', 'none')
	  .attr('stroke', function (d, i) { return colors(i); })	
}

function plotData(data, province, crime, year) {
	var dataset
	for (var i = 0; i < Things.length; i++) {
		Things[i]
	};

}
function fillMap(data) {
	for (var i = 0; i < provinces.length; i++) {
		d3.select("[title=" + String(provinces[i]) + "]")
			.style('fill', calcFill(data, provinces[i],crime,year,total))
	};

}

function calcFill(data, province, crime, year, total) {

	var index
	var value = data[province][crime][year]
	var perc = value/total*100
	var percIndex = [2, 4, 8, 16, 32, 64]


	if (perc <= percIndex[0]){
		index = 0
	}
	else if (perc <= percIndex[1]){
		index = 1
	}
	else if (perc <= percIndex[2]){
		index = 2
	}
	else if (perc <= percIndex[3]){
		index = 3
	}
	else if (perc <= percIndex[4]){
		index = 4
	}
	else if (perc >= percIndex[5]){
		index = 5
	}

	return String(colors[index]) 
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function yearFunction() {
    document.getElementById("yearDrop").classList.toggle("show");
    document.getElementById("crimeDrop").classList.remove('show');
}
function crimeFunction() {
    document.getElementById("crimeDrop").classList.toggle("show");
    document.getElementById("yearDrop").classList.remove('show');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
