// datamap variables
var preProvince 
var curProvince = 'Nederland'
var pointProvince
var curCrime = 'totaal'
var year = '3'
var total
var provinces = ['Groningen','Friesland','Gelderland','Drenthe','Overijssel','Flevoland','Utrecht','Noord-Holland','Zuid-Holland','Zeeland','Noord-Brabant','Limburg']
var years = ['2010','2011','2012','2013']
var colors = ['#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#b10026']
var crimes = []

// lineplot variables
var plotMargin = { top: 30, right: 20, bottom: 30, left: 40 };
var plotWidth = 500 - plotMargin.left - plotMargin.right;
var plotHeight = 270 - plotMargin.top - plotMargin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale().range([0, plotWidth]);
var y = d3.scale.linear().range([plotHeight, 0]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(4);
var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(5);

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
	.attr('id', 'maintitle')
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

		fillMap(data, curCrime, year)
		makePlot(plotData(data, curCrime))
		makePie(dataPie(data, curCrime, year))

		d3.selectAll('.land')
			.on('mouseover', function(){
				pointProvince = d3.select(this).attr('title')
				d3.select(this)
					.style('opacity', 0.5)
					.style('stroke', 'grey')
					.style('stroke-width', 3)
			})
			.on('mouseout', function(){
				d3.select('#map [title="'+pointProvince+'"]')
					.style('opacity', null)
					.style('stroke', null)
					.style('stroke-width', null)
			})
			.on('click', function(){
				curProvince = pointProvince
				makePie(provincePie(data, curProvince, year))
			})

		d3.selectAll('.province-label')
			.on('mouseover', function(){
				pointProvince = this.id
				d3.select(this)
					.style('opacity', 0.5)
					.style('stroke', 'grey')
					.style('stroke-width', 3)

				d3.select('#map [title="'+pointProvince+'"]')
					.style('opacity', 0.5)
					.style('stroke', 'grey')
					.style('stroke-width', 3)
			})
			.on('mouseout', function(){
				d3.select('#'+pointProvince)
					.style('opacity', null)
					.style('stroke', null)
					.style('stroke-width', null)

				d3.select('#map [title="'+pointProvince+'"]')
					.style('opacity', null)
					.style('stroke', null)
					.style('stroke-width', null)
			})
			.on('click', function(){
				curProvince = pointProvince
				makePie(provincePie(data, curProvince, year))
			})

		d3.selectAll('.crimeDrop')
			.on('click', function(){
				curCrime = this.innerHTML

				fillMap(data, curCrime, year)
				makePlot(plotData(data, curCrime))

				if (curProvince == 'Nederland') {
					makePie(dataPie(data, curCrime, year))
				} else {
					makePie(provincePie(data, curProvince, year))
				}

			})

		d3.select('#home')
			.on('click', function(){
				curProvince = 'Nederland'
				makePie(dataPie(data, curCrime, year))
			})
	})
});
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