/**
 * Dirk Zomerdijk
 * 10530274
 * Bèta-gamma
 * Crime explorer
 * Main script javascript
 */

// Set global variables
var nedTotaalPlot
var preProvince 
var curProvince = 'Nederland'
var pointProvince
var pointCrime
var curCrime = 'totaal'
var year = '3'
var years = ['2010','2011','2012','2013']
var total
var crimes = []

// set Datamap variables
var provinces = ['Groningen','Friesland','Gelderland','Drenthe','Overijssel','Flevoland','Utrecht','Noord-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg']
var inwoners= {'Groningen': 583942,'Friesland': 646257,'Gelderland': 2026578,'Drenthe': 488576,'Overijssel': 1140652,'Flevoland': 401791,'Utrecht': 1263572,'Noord-Holland': 2761929,'Zuid-Holland': 3600011,'Zeeland': 380726,'Noord-Brabant': 2488751,'Limburg': 1117941,'Nederland': 16900726}
var colors = ['#fff7fb','#ece2f0','#d0d1e6','#a6bddb','#67a9cf','#3690c0','#02818a','#016c59','#014636']
var percIndex = [5, 10, 15, 20, 25, 30, 35, 40, 45]
var legendIndex = ['< 5%', '5-10%', '10-15%', '15-20%', '20-25%', '25-30%', '30-35%', '35-40%', '40% >']
var selProvince = false

// Set lineplot variables
var plotMargin = { top: 20, right: 0, bottom: 20, left: 25 };
var plotWidth = 350 - plotMargin.left - plotMargin.right;
var plotHeight = 200 - plotMargin.top - plotMargin.bottom;
var isPlot = false

// Initiate dateparser
var parseDate = d3.time.format("%Y").parse;

// Set scales for x axis and y axis for lineplot
var x = d3.time.scale().range([0, plotWidth]);
var y = d3.scale.linear().range([plotHeight, 0]);

// Initiate x and y axis
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(4)
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(6, 's')

// Append plot svg to container
var plot = d3.select("#plotContainer")
  .append("svg")
    .attr('id','plot')
    .attr("width", plotWidth + plotMargin.left + plotMargin.right)
    .attr("height", plotHeight + plotMargin.top + plotMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + (plotMargin.left + 50) +"," + plotMargin.top + ")");

// Append label for y axis
var yLabel = d3.select('#plotContainer').append('div')
	.attr('id', 'ylabel')
	.style('transform', 'rotate(-90deg)')
	.text('Aantal misdrijven')


// Pie chart variables
var pieColors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']
var pieWidth = 300;
var pieHeight = 300;
var radius = Math.min(pieWidth, pieHeight) / 2;
var radiusHover = Math.min(pieWidth, pieHeight) / 1.9;
var donutWidth = 60;

// Set domain and range for piechart
var color = d3.scale.ordinal()
	.range(pieColors)
	.domain(provinces)

// Set inner and outer radius for arc of piechart
var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - donutWidth)
var arcHover = d3.svg.arc()
	.outerRadius(radiusHover)
	.innerRadius(radiusHover - donutWidth)

// Set slider variables
var sliderWidth = 200;
var sliderHeight = 100;
var sliderRadius = 10;
var sliderMargin = 20;
var sliderx1 = sliderMargin;
var sliderx2 = sliderWidth - sliderMargin;
var slidery = sliderHeight / 2;

// Create slider container and add slider svg 
var slider = d3.select("body")
  .append('div')
  	.attr('id', 'slidercontainer')
  .append("svg")
	.attr('id', 'slider')
  	.attr("width", sliderWidth)
  	.attr("height", sliderHeight)
  	.datum({
    x: sliderWidth - sliderMargin,
    y: sliderHeight / 2
  });

// Append slider to svg
var line = slider.append("line")
	.attr("x1", sliderx1)
	.attr("x2", sliderx2)
	.attr("y1", slidery)
	.attr("y2", slidery)
	.style("stroke", "black")
	.style("stroke-linecap", "round")
	.style("stroke-width", 5);

// Initiate titles 
var piePercentage = d3.select('#pieContainer').append('div')
	.attr('id', 'percentage')
	.text('%')

var plotTitle = d3.select('#plotContainer').append('div').append('h3')
	.attr('id', 'plottitle')
	.html('NL')

var plotSubtitle = d3.select('#plotContainer').append('div').append('h3')
  	.attr('id', 'plotsubtitle')
  	.html('Totaal')

var plotInfo = d3.select('#plotContainer').append('div')
	.attr('id', 'plotvalues')
	.html('value1<br><br>value2<br><br>value3<br><br>value4')

var sliderTitle = d3.select("#slidercontainer").append('div')
	.attr('id', 'slidertitle')
	.text('201'+year)

// Append datamap
d3.xml('maps/nederland.svg', 'image/svg+xml', function(error, xml) {
	if (error) throw error;
	
	document.getElementById('mapContainer').appendChild(xml.documentElement)
		.setAttribute('id', 'map');

	// Scale datamap
	d3.select('g').attr('transform','scale(0.6)')

	// Get data
	d3.json('data/dataCrimi.json', function(error, data) {
		if (error) throw error;

		// Create sorted array containing crimes from data
		for (var k in data.Groningen) crimes.push(k);
		crimes.sort();
		
		// Append crimes to dropdownmenu
		for ( var i = 0; i < crimes.length; i++ ) {
			document.getElementById('crimeDrop').innerHTML += "<a href='#' class='crimeDrop' id=" + crimes[i].replace(/\s+/g, '') + ">" + String(crimes[i]) + "</a>"
		} 

		// Initiate legend
		var legend = d3.select('#mapContainer').append('div')
			.attr('id', 'legend')
		for (var i = 0; i < colors.length; i++) {
			d3.select('#map').append('rect')
				.attr('width', 20)
				.attr('height', 10)
				.attr('id', 'rect'+i)
				.attr('y', 70 +i*14.3)
				.attr('x', 0)
				.style('fill', colors[i]);

			legend.append('div')
				.html(legendIndex[i])
				.attr('class', 'recttxt')
		};

		// Get the modal
		var modal = document.getElementById('myModal');

		// Get the button that opens the modal
		var btn = document.getElementById("infoBtn");

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("close")[0];

		// When the user clicks the button, open the modal 
		btn.onclick = function() {
		    modal.style.display = "block";
		}

		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
		    modal.style.display = "none";
		}

		// initiate drag
	    var drag = d3.behavior.drag()
	      .origin(function(d) { return d; })
	      .on("drag", dragmove);
	    
	    // Append circle to slider
	    var circle = slider.append("circle")
	      .attr("r", sliderRadius)
	      .attr("cy", function(d) { return d.y; })
	      .attr("cx", function(d) { return d.x; })
	      .style("cursor", "ew-resize")
	      .call(drag);
		
		// Dragmove function (This was a problem thats why its here)
		function dragmove(d) {
		  
			// Get the updated X location computed by the drag behavior.
			var x = d3.event.x;
			var pointValue = sliderx2 / 4
			
			// Checks current province and selects the right piechart
			if (curProvince == 'Nederland')
				var choosePie = makePie(dataPie(data, curCrime, year))
			else {
				var choosePie = makePie(provincePie(data, curProvince, year))
			}
			
			// Checks position of slider, updates 'year' and calcs percentage
			if (x <= pointValue) {
				year = '0'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#slidertitle')
					.text('201'+year)
				d3.select('#percentage')
					.text(function() {
						if (curCrime != 'totaal') {
							return calcPerc(data, curProvince, curCrime, year)+'%'
						}
					})		
			}
			else if (x <= pointValue*2) {
				year = '1'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#slidertitle')
					.text('201'+year)
				d3.select('#percentage')
					.text(function() {
						if (curCrime != 'totaal') {
							return calcPerc(data, curProvince, curCrime, year)+'%'
						}
					})	
			}
			else if (x <= pointValue*3) {
				year = '2'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#slidertitle')
					.text('201'+year)
				d3.select('#percentage')
					.text(function() {
						if (curCrime != 'totaal') {
							return calcPerc(data, curProvince, curCrime, year)+'%'
						}
					})	
			}
			else if (x <= pointValue*4) {
				year = '3'
				fillMap(data, curCrime, year)
				choosePie
				d3.select('#slidertitle')
					.text('201'+year)
				d3.select('#percentage')
					.text(function() {
						if (curCrime != 'totaal') {
							return calcPerc(data, curProvince, curCrime, year)+'%'
						}
					})		
			}


			// Constrain x to be between x1 and x2 (the ends of the line).
			x = x < sliderx1 ? sliderx1 : x > sliderx2 ? sliderx2 : x;

			// This assignment is necessary for multiple drag gestures.
			// It makes the drag.origin function yield the correct value.
			d.x = x;

			// Update the circle location.
			circle.attr("cx", x);
		}
		
		// Update data with correct total values of each province
		var data0 = 0, data1 = 0, data2 = 0, data3 = 0;
		var nedTotaal0 = 0, nedTotaal1 = 0, nedTotaal2 = 0, nedTotaal3 = 0;      
		for (var j = 0; j < provinces.length; j++) {
		    for (var i = 0; i < crimes.length-1; i++) {
		    	data0 += +data[provinces[j]][crimes[i]]['0']
		    	data1 += +data[provinces[j]][crimes[i]]['1']
		    	data2 += +data[provinces[j]][crimes[i]]['2']
		    	data3 += +data[provinces[j]][crimes[i]]['3']
		    };

		    // Creates object for lineplot with total and Netherlands selected as crime and province
		    var totProvince = [data0, data1, data2, data3]
		    data[provinces[j]].totaal = totProvince
		    data0 = 0, data1 = 0, data2 = 0, data3 = 0

		    nedTotaal0 += +data[provinces[j]].totaal['0']
		    nedTotaal1 += +data[provinces[j]].totaal['1']
		    nedTotaal2 += +data[provinces[j]].totaal['2']
		    nedTotaal3 += +data[provinces[j]].totaal['3']
		}
		nedTotaalPlot = [
		{'Value': nedTotaal0, 'Year':years[0]},
		{'Value': nedTotaal1, 'Year':years[1]},
		{'Value': nedTotaal2, 'Year':years[2]},
		{'Value': nedTotaal3, 'Year':years[3]}
		]

		// Make default map, plot and pie
		fillMap(data, curCrime, year)
		makePlot(nedTotaalPlot)
		makePie(totalPie(data, year))

		// Calls all eventlistners
		callListeners(data)
		window.onclick = function(event) {
			callListeners(data)
		    if (event.target == modal) {
		        modal.style.display = "none";
		    }
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

// Blocks scrolling to trap the presentation
$(document).ready(function () {
      $(document).keydown(function (event) {
          if (event.ctrlKey == true && (event.which == '107' || event.which == '109' || event.which == '187' || event.which == '189'))
           {
               event.preventDefault();
           }
       });

           $(window).bind('mousewheel DOMMouseScroll', function (event) {
               if (event.ctrlKey == true) {
                   event.preventDefault();
               }

      });
 });