var pieData
var mapData
var plotData

var lineChart
var pieChart
var isPlot = false
var isPie = false

var province = 'Nederland'
var curProvince = 'Nederland'
var crime = 'totaal' 
var year = '3'
var total
var provinces = ['Groningen','Friesland','Gelderland','Drenthe','Overijssel','Flevoland','Utrecht','Noord-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg']
var years = ['2010','2011','2012','2013']
var colors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
var crimes = []

// lineplot variables
var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 40
};
var width = 500 - margin.left - margin.right;
var height = 270 - margin.top - margin.bottom;
var parseDate = d3.time.format("%Y").parse;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);
var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var pieColors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']
var widthPie = 300;
var heightPie = 300;
var radius = Math.min(widthPie, heightPie) / 2;
var donutWidth = 35;
var color = d3.scale.ordinal()
	.range(pieColors)
	.domain(provinces)
var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - donutWidth)

var widthSlider = 480;
var xSlider = d3.scale.linear()
    .domain([2010, 2013])
    .range([0, widthSlider])
    .clamp(true);
var dispatch = d3.dispatch("sliderChange");
var slider = d3.select(".slider")
    .style("width", widthSlider + "px");
var sliderTray = slider.append("div")
    .attr("class", "slider-tray");
var sliderHandle = slider.append("div")
    .attr("class", "slider-handle");
sliderHandle.append("div")
    .attr("class", "slider-handle-icon")

slider.call(d3.behavior.drag()
    .on("dragstart", function() {
      dispatch.sliderChange(xSlider.invert(d3.mouse(sliderTray.node())[0]));
      d3.event.sourceEvent.preventDefault();
    })
    .on("drag", function() {
      dispatch.sliderChange(xSlider.invert(d3.mouse(sliderTray.node())[0]));
    })
);

dispatch.on("sliderChange.slider", function(value) {
  	sliderHandle.style("left", xSlider(value) + "px")
  	// console.log(value)
  	// if (value <= 2010.5) {
  	// 	console.log(2010)
  	// }  	
  	// else if (value >= 2010.6) {
  	// 	console.log(2011)
  	// }
  	// else if (value >= 2011.6) {
  	// 	console.log(2012)
  	// }
  	// else if (value >= 2012.6) {
  	// 	console.log(2013)
  	// }
});

var container = d3.select('body').append('div')
	.attr('id','container');


d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	
	document.getElementById('container').appendChild(xml.documentElement)
		.setAttribute('id', 'map');

	d3.select('g').attr('transform','scale(0.8)')

	lineChart = d3.select("#container")
	    .append("svg")
	    .attr('id','plot')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + (margin.left + 50) +"," + margin.top + ")");
	
	d3.json('data/dataCrimi.json', function(error, data) {
		if (error) throw error;
		dataset = data

		for (var k in data.Groningen) crimes.push(k);
		crimes.sort();

		for ( var i = 0; i < crimes.length; i++ ) {
			document.getElementById('crimeDrop').innerHTML += "<a href='#' class='crime' id=" + crimes[i].replace(/\s+/g, '') + ">" + String(crimes[i]) + "</a>"
		} 

		var mainTitle = d3.select('body').append('div').append('h1')
			.attr('id', 'maintitle')
			.text(crime+", 201"+year)

		var pieTitle = d3.select('body').append('div').append('h3')
			.attr('id', 'pietitle')
			.text('Provincie jaar:')

		var plotTitle = d3.select('body').append('div').append('h3')
			.attr('id', 'plottitle')
			.text(crime+' in '+province+' van \'10 to \'13')
		
		makePlot(plotData(data, crime))
		fillMap(data, crime, year)
		makePie(dataPie(data, crime, year))

		d3.selectAll('a.crime')
			.on('click', function(){
				crime = document.getElementById(this.id).textContent
				if (province == 'Nederland') {
					makePie(dataPie(data, crime, year)) 
				}
				else{
					makePie(provincePie(data, province, year))
				}; 
				makePlot(plotData(data, crime))
				fillMap(data, crime, year)

				d3.select('#maintitle').text(crime+", 201"+year)
				d3.select('#plottitle').text(crime+' in '+province+' van \'10 to \'13')
				d3.select('path.'+fuseString(crime))
					.style('opacity', 0.5)
					.style('stroke', 'grey')	
					.style('stroke-width', 5)	
		})

		d3.selectAll('a.year').on('click', function(){
			year = this.id
			fillMap(data, crime, year)
			if (province == 'Nederland') {
				makePie(dataPie(data, crime, year)) 
			}
			else{
				makePie(provincePie(data, province, year))				
			}; 
			d3.select('#maintitle').text(crime+", 201"+year)
			d3.select('#plottitle').text(crime+' in '+province+' van \'10 to \'13')
		})

		d3.selectAll('[title]')
			.on('mouseover', function(){
				province = document.getElementById(this.id).getAttribute('title')
				d3.select('path.'+province)
					.style('opacity', 0.5)
					.style('stroke', 'grey')
					.style('stroke-width', 3)
				d3.select('#pietitle').text(province+' 201'+year+' : '+data[province][crime][year])
			})
			.on('mouseout', function(){
				province = document.getElementById(this.id).getAttribute('title')
				d3.select('path.'+province)
					.style('opacity', null)
					.style('stroke', null)
					d3.select('#pietitle').text(curProvince+' 201'+year+' : '+data[province][crime][year])			
			})
			.on('click', function(){
				curProvince = document.getElementById(this.id).getAttribute('title')
				makePie(provincePie(data, province, year))
				makePlot(plotProvince(data, province, crime))
				d3.select('#maintitle').text(crime+", 201"+year)
				d3.select('#plottitle').text(crime+' in '+province+' van \'10 tot \'13')
				if (province != 'Nederland'){
					d3.selectAll('#map path').style('opacity', null)
					d3.select('#map [title="'+province+'"]')
						.style('opacity', 0.5)
				}
			})
		
		d3.selectAll('#pie path')
			.on('mouseover', function(){
				province = this.id
				d3.select(this)
					.style('opacity', 0.5)
					.style('stroke', 'grey')
					.style('stroke-width', 3)
				d3.select('#pietitle').text(province+' 201'+year+' : '+data[province][crime][year])
				document.querySelector('path[title="' + this.id + '"]')
					.setAttribute('opacity', 0.5)
			})
			.on('mouseout', function(){
				d3.select(this)
					.style('opacity', null)
					.style('stroke', 'grey')
					.style('stroke-width', 0)
				document.querySelector('path[title="' + this.id + '"]')
					.setAttribute('opacity', null)
			})
			.on('click', function(){
				curProvince = document.getElementById(this.id).getAttribute('title')
				makePie(provincePie(data, province, year))
				makePlot(plotProvince(data, province, crime))
				d3.select('#maintitle').text(crime+", 201"+year)
				d3.select('#plottitle').text(crime+' in '+province+' van \'10 tot \'13')
				d3.select('path.'+fuseString(crime))
					.style('opacity', 0.5)
					.style('stroke', 'grey')	
					.style('stroke-width', 3)				
			})
		d3.select('#home')
			.on('click', function(){
				d3.selectAll('#map path').style('opacity', null)
				crime = 'totaal'
				province = 'Nederland'
				year = '3'
				makePlot(plotData(data, crime))
				fillMap(data, crime, year)
				makePie(dataPie(data, crime, year))
				d3.select('#maintitle').text(crime+", 201"+year)
				d3.select('#plottitle').text(crime+' in '+province+' van \'10 tot \'13')
			})	
	})
})

function makePie(data) {
	
	d3.select('#pie').remove()

	pieChart = d3.select('#container')
	  	.append("svg")
			.attr("id", "pie")
		    .attr("width", width)
		    .attr("height", height)
	  	  .append("g")
	    		.attr("transform", "translate(" + width /2.7 + "," + height/1.35 + ")");

	var pie = d3.layout.pie()
	    .value(function(d) { return d.count})

	var g = pieChart.selectAll(".arc")
		.data(pie(data))
	  .enter().append("g")
		.attr("class", "arc" )

	g.append("path")
		.attr("class", function(d){ return d.data.label})
		.attr("id", function(d){ return d.data.label})
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
};
function provincePie(data, province, year) {
	var pieData = []
	for (var i = 0; i < crimes.length; i++) {
		var curLabel = crimes[i]
		var curCount = data[province][curLabel][year]
		var obj = {'label': curLabel, 'count': curCount}
		pieData.push(obj)
	};
	return pieData
}


function makePlot(data) {

    data.forEach(function(d) {
        d.Year = parseDate(d.Year);
        d.Value = +d.Value;
    });

	if (isPlot == true){
		var valueline = d3.svg.line()
	    	.x(function (d) { return x(d.Year);})
	    	.y(function (d) { return y(d.Value);})
	    	.interpolate("monotone");
		// Scale the range of the data
		x.domain(d3.extent(data, function (d) { return d.Year; }));
		y.domain([0, d3.max(data, function (d) { return d.Value + d.Value/5; })]);

		var change = d3.select("#plot").transition().duration(200);

		change.select(".x.axis").call(xAxis)
		change.select(".y.axis").call(yAxis)
		change.select(".diddle").attr('d', valueline(data))
	}
	else {
		var valueline = d3.svg.line()
		    .x(function (d) { return x(d.Year);})
		    .y(function (d) { return y(d.Value);})
		    .interpolate("monotone");

		// Scale the range of the data
		x.domain(d3.extent(data, function (d) { return d.Year; }));
		y.domain([0, d3.max(data, function (d) { return d.Value + d.Value/5; })]);

		lineChart.append("path") // Add the valueline path.
		.attr("d", valueline(data))
		.attr('class', 'diddle')

		lineChart.append("g") // Add the X Axis
			.attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis);

		lineChart.append("g") // Add the Y Axis
			.attr("class", "y axis")
		    .call(yAxis);
		isPlot = true;
	};
};

function plotProvince(data, province, crime) {
	obj = data[province][crime]
	dataset = [
	{'Value': obj[0], 'Year':years[0]},	
	{'Value': obj[1], 'Year':years[1]},
	{'Value': obj[2], 'Year':years[2]},
	{'Value': obj[3], 'Year':years[3]}	
	]
	return dataset
}

function plotData(data, crime) {
	var obj, tien = 0, elf = 0, twaalf = 0, dertien = 0;
	for (var i = 0; i < provinces.length; i++) {
		obj = data[provinces[i]][crime];
		tien += +obj[0]
		elf += +obj[1]
		twaalf += +obj[2]
		dertien += +obj[3]
	};
	var dataset =[
	{'Value': tien, 'Year':years[0]},
	{'Value': elf, 'Year':years[1]},
	{'Value': twaalf, 'Year':years[2]},
	{'Value': dertien, 'Year':years[3]}
	]
	return dataset
};

function fillMap(data, crime, year) {
	total = calcTotal(data, crime)
	for (var i = 0; i < provinces.length; i++) {
		d3.select("[title=" + String(provinces[i]) + "]")
			.style('fill', calcFill(data, provinces[i],crime,year,calcTotal(data, crime)))
	};
};

function calcTotal(data, crime){
	var total = 0
	for (var i = 0; i < provinces.length; i++) {
		total += +data[String(provinces[i])][crime][year]
	};
	return total
};

function calcFill(data, province, crime, year, total) {
	var index
	var value = data[province][crime][year]
	var perc = value/total*100
	var percIndex = [2, 4, 8, 16, 32, 64]
	console.log(value)
	if (value == 0){
		index = 0
	}
	else if (perc <= percIndex[0]){
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
	console.log(index)
	return String(colors[index]) 
};
function fuseString(string) {
	return string.replace(/[^a-zA-Z]/g,'');
}
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function yearFunction() {
    // document.getElementById("yearDrop").classList.toggle("show");
    document.getElementById("crimeDrop").classList.remove('show');
}
function crimeFunction() {
    document.getElementById("crimeDrop").classList.toggle("show");
    // document.getElementById("yearDrop").classList.remove('show');
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

