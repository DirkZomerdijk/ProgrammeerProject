// datamap variables
var preProvince 
var curProvince = 'Nederland'
var pointProvince
var pointCrime
var curCrime = 'totaal'
var year = '3'
var total
var provinces = ['Groningen','Friesland','Gelderland','Drenthe','Overijssel','Flevoland','Utrecht','Noord-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg']
var years = ['2010','2011','2012','2013']
var colors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
var crimes = []

var selProvince = false

// lineplot variables
var plotMargin = { top: 20, right: 80, bottom: 20, left: 20 };
var plotWidth = 500 - plotMargin.left - plotMargin.right;
var plotHeight = 270 - plotMargin.top - plotMargin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale().range([0, plotWidth]);
var y = d3.scale.linear().range([plotHeight, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(4)
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(6)

var plot = d3.select("#plotContainer")
  .append("svg")
    .attr('id','plot')
    .attr("width", plotWidth + plotMargin.left + plotMargin.right)
    .attr("height", plotHeight + plotMargin.top + plotMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + (plotMargin.left + 50) +"," + plotMargin.top + ")");
var isPlot = false

// pie chart variables
var pieColors = ['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695']
var pieWidth = 200;
var pieHeight = 200;
var radius = Math.min(pieWidth, pieHeight) / 2;
var donutWidth = 35;
var color = d3.scale.ordinal()
	.range(pieColors)
	.domain(provinces)
var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - donutWidth)

var mainTitle = d3.select('#mainContainer').append('div').append('h1')
	.attr('id', 'maintitle')
	.text('mainTitle')

var mapTitle = d3.select('#mapContainer').append('div').append('h3')
	.attr('id', 'mapTitletitle')
	.text('mapTitle')

var pieTitle = d3.select('#pieContainer').append('div').append('h3')
	.attr('id', 'pietitle')
	.text('pieTitle')

var plotTitle = d3.select('#plotContainer').append('div').append('h3')
	.attr('id', 'plottitle')
	.text('plotTitle')

d3.xml('nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	
	document.getElementById('mapContainer').appendChild(xml.documentElement)
		.setAttribute('id', 'map');

	d3.select('g').attr('transform','scale(0.8)')

	d3.json('data/dataCrimi.json', function(error, data) {
		if (error) throw error;

		for (var k in data.Groningen) crimes.push(k);
		crimes.sort();
		
		for ( var i = 0; i < crimes.length; i++ ) {
			document.getElementById('crimeDrop').innerHTML += "<a href='#' class='crimeDrop' id=" + crimes[i].replace(/\s+/g, '') + ">" + String(crimes[i]) + "</a>"
		} 
	    var width = 700;
	    var height = 100;
	    var radius = 10;
	    var margin = 100;
	    
	    var x1 = margin;
	    var x2 = width - margin;
	    var y = height / 2;
	        
	    var drag = d3.behavior.drag()
	      .origin(function(d) { return d; })
	      .on("drag", dragmove);
	    
	    var slider = d3.select("body")
	      .append('div')
	      	.attr('id', 'slidercontainer')
	      .append("svg")
	    	.attr('id', 'slider')
	      	.attr("width", width)
	      	.attr("height", height)
	      	.datum({
	        x: width - margin,
	        y: height / 2
	      });
	    
	    var line = slider.append("line")
	      .attr("x1", x1)
	      .attr("x2", x2)
	      .attr("y1", y)
	      .attr("y2", y)
	      .style("stroke", "black")
	      .style("stroke-linecap", "round")
	      .style("stroke-width", 5);

	    var circle = slider.append("circle")
	      .attr("r", radius)
	      .attr("cy", function(d) { return d.y; })
	      .attr("cx", function(d) { return d.x; })
	      .style("cursor", "ew-resize")
	      .call(drag);
	    
	    function dragmove(d) {
	      
			// Get the updated X location computed by the drag behavior.
			var x = d3.event.x;
			var pointValue = x2 / 4
			
			if (curProvince == 'Nederland')
				var choosePie = makePie(dataPie(data, curCrime, year))
			else {
				var choosePie = makePie(provincePie(data, curProvince, year))
			}
			
			if (x <= pointValue) {
				year = '0'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#pietitle')
					.text(curProvince+', '+curCrime+', 201'+year)
			}
			else if (x <= pointValue*2) {
				year = '1'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#pietitle')
					.text(curProvince+', '+curCrime+', 201'+year)
			}
			else if (x <= pointValue*3) {
				year = '2'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#pietitle')
					.text(curProvince+', '+curCrime+', 201'+year)
			}
			else if (x <= pointValue*4) {
				year = '3'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#pietitle')
					.text(curProvince+', '+curCrime+', 201'+year)
			}
			// Constrain x to be between x1 and x2 (the ends of the line).
			x = x < x1 ? x1 : x > x2 ? x2 : x;

			// This assignment is necessary for multiple drag gestures.
			// It makes the drag.origin function yield the correct value.
			d.x = x;

			// Update the circle location.
			circle.attr("cx", x);
	    }

		fillMap(data, curCrime, year)
		makePlot(plotData(data, curCrime))
		makePie(dataPie(data, curCrime, year))

		callListeners(data)
		window.onclick = function(event) {
			callListeners(data)
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
	})
});
