function makePie(data) {
	d3.select('#pie').remove()

	pieChart = d3.select('#pieContainer')
	  	.append("svg")
			.attr("id", "pie")
		    .attr("width", 600)
		    .attr("height", 600)
	  	  .append("g")
	    		.attr("transform", "translate(" + pieWidth  + "," + pieHeight*1.3 + ")");

	var pie = d3.layout.pie()
	    .value(function(d) { return d.count})

	var g = pieChart.selectAll(".arc")
		.data(pie(data))
	  .enter().append("g")
		.attr("class", "arc")

	g.append("path")
		.attr("class", selPieClass(data))
		.attr("id", function(d){ return d.data.label})
		  	.attr("d", arc)
	  	.style("fill", function(d) { return color(d.data.label); });

};

function selPieClass (data) {
	if (data.length == crimes.length-1 ) {
		return 'crime-label'
	}
	else {
		return 'province-label'
	}
}
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
	for (var i = 0; i < crimes.length-1; i++) {
		var curLabel = crimes[i]
		var curCount = data[province][curLabel][year]
		var obj = {'label': curLabel, 'count': curCount}
		pieData.push(obj)

	};
	return pieData
}
function totalPie(data, year) {
	//http://www.metatopos.eu/provincies.html
	var nedTotaalPie = []
	var test = 0
	for (var i = 0; i < provinces.length; i++) {

		var curLabel = provinces[i]
		var curCount = data[provinces[i]].totaal[year]
		var people = inwoners[provinces[i]]
		var multyplier = 100 - (people / inwoners['Nederland'] * 100)
		var obj = {'label': curLabel, 'count': curCount*multyplier}
		nedTotaalPie.push(obj)
	};
	return nedTotaalPie	
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
		x.domain(d3.extent(data, function (d) { return d.Year; })).nice();
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

		plot.append("path") // Add the valueline path.
		.attr("d", valueline(data))
		.attr('class', 'diddle')

		plot.append("g") // Add the X Axis
			.attr("class", "x axis")
		    .attr("transform", "translate(0," + plotHeight + ")")
		    .call(xAxis);


		plot.append("g") // Add the Y Axis
			.attr("class", "y axis")
		    .call(yAxis)

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

function plotTotal(data, province){
	var check = 0, data0 = 0, data1 = 0, data2 = 0, data3 = 0;
    for (var i = 0; i < crimes.length-1; i++) {
    	data0 += +data[province][crimes[i]]['0']
    	data1 += +data[province][crimes[i]]['1']
    	data2 += +data[province][crimes[i]]['2']
    	data3 += +data[province][crimes[i]]['3']
    };
    var totProvince = [
    	{'Value': data0, 'Year': years[0]},
    	{'Value': data1, 'Year': years[1]},
    	{'Value': data2, 'Year': years[2]},
    	{'Value': data3, 'Year': years[3]}
    ]    
    data[province].totaal = totProvince
	return totProvince
}

function fillMap(data, crime, year) {
	// total = calcTotal(data, crime)
	for (var i = 0; i < provinces.length; i++) {
		d3.select("[title=" + String(provinces[i]) + "]")
			.style('fill', calcFill(data, provinces[i],crime,year,calcTotal(data, curCrime)))

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
	var percIndex = [5, 10, 15, 20, 25, 30, 35, 40, 45]
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
	else if (perc <= percIndex[5]){
		index = 5
	}
	else if (perc <= percIndex[6]){
		index = 6
	}
	else if (perc <= percIndex[7]){
		index = 7
	}
	else if (perc <= percIndex[8]){
		index = 8
	}
	else if (perc >= percIndex[9]){
		index = 9
	}
	return String(colors[index]) 
};
function fuseString(string) {
	return string.replace(/[^a-zA-Z]/g,'');
}
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
// function yearFunction() {
    // document.getElementById("yearDrop").classList.toggle("show");
    // document.getElementById("crimeDrop").classList.remove('show');
// }
function crimeFunction() {
    document.getElementById("crimeDrop").classList.toggle("show");
    // document.getElementById("yearDrop").classList.remove('show');
}


function calcPerc(data, province, crime, year) {
	var result
	var totalNed = nedTotaalPlot[year].Value
	var totalProvince = data[province]['totaal'][year]
	var crimeProvince = data[province][crime][year]
	var crimeTotal = calcTotal(data, crime)

	var percProvince = totalProvince / totalNed * 100
	var percCrime = crimeProvince / totalProvince * 100
	var percCrimeProvince = crimeProvince / crimeTotal * 100

	if (curCrime == 'totaal' && curProvince == 'Nederland') {
		result = Math.round(percProvince)
	}
	else if (curCrime != 'totaal' && curProvince == 'Nederland') {
		result = Math.round(percCrimeProvince)
	}
	else {
		result = Math.round(percCrime)
	}
	return result
}
function callListeners(data) {

	d3.selectAll('.land')
		.on('mouseover', function(){
			pointProvince = d3.select(this).attr('title')
			d3.select('#'+pointProvince)
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 2)		
			if (curProvince == 'Nederland'){
			d3.select('#percentage')
				.text(calcPerc(data, pointProvince, curCrime, year)+'%')
			};		
			d3.select("#plottitle")
				.text(d3.select('[title="'+pointProvince+'"]').attr('id').substring(3))		
		})
		.on('mouseout', function(){
			d3.select('#'+pointProvince)
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null)
			d3.select('#percentage')
				.text('%')		
			d3.select("#plottitle")
				.text(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))		
		})
		.on('click', function(){
			preProvince = curProvince
			curProvince = pointProvince
			d3.select('#map [title="'+curProvince+'"]')
				.style('opacity', 0.5)
				.style('stroke', 'steelblue')
				.style('stroke-width', 2)
			d3.select('#map [title="'+preProvince+'"]')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null)			

			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))
			

			d3.select('#pietitle')
				.text(curProvince+', '+curCrime+', 201'+year)

			makePie(provincePie(data, curProvince, year))
			makePlot(plotProvince(data, curProvince, curCrime))
		})

	d3.selectAll('.province-label')
		.on('mouseover', function(){
			pointProvince = this.id
			d3.select(this)
				.attr('d', arcHover)
			d3.select('#map [title="'+pointProvince+'"]')
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 2)
			if (curProvince == 'Nederland'){
			d3.select('#percentage')
				.text(calcPerc(data, pointProvince, curCrime, year)+'%')
			};	
			d3.select("#plottitle")
				.text(d3.select('[title="'+pointProvince+'"]').attr('id').substring(3))
		})
		.on('mouseout', function(){
			d3.select('#'+pointProvince)
				.attr('d', arc)

			d3.select('#map [title="'+pointProvince+'"]')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null)
			d3.select('#percentage')
				.text('%')	
			d3.select("#plottitle")
				.text(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))			
		})
		.on('click', function(){
			curProvince = pointProvince
			makePie(provincePie(data, curProvince, year))
			makePlot(plotProvince(data, curProvince, curCrime))
			d3.select('#pietitle')
				.text(curProvince+', '+curCrime+', 201'+year)
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))
			d3.select('#plotsubtitle')
				.text(curCrime)
		})


	d3.selectAll('.crime-label')
		.on('mouseover', function(){
			pointCrime = this.id
			d3.select(this)
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 3)
				.attr('d', arcHover)	
			d3.select('#percentage')
				.text(calcPerc(data, curProvince, pointCrime, year)+'%')
			d3.select('#plotsubtitle')
				.text(pointCrime)
		})
		.on('mouseout', function(){
			d3.select(this)
				.attr('d', arc)			
			d3.select(this)
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null)
			d3.select('#percentage')
				.text(calcPerc(data, curProvince, curCrime, year)+'%')
			d3.select('#plotsubtitle')
				.text(curCrime)

		})
		.on('click', function() {
			curCrime = this.id
			makePlot(plotProvince(data, curProvince, curCrime))
			fillMap(data, curCrime, year)
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))
			d3.select('#plotsubtitle')
				.text(curCrime)
			d3.select('#maptitle')
				.text(curCrime+', 201'+year)
			d3.select('#pietitle')
				.text(curProvince+', '+curCrime+', 201'+year)
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
			d3.select('#pietitle')
				.text(curProvince+', '+curCrime+', 201'+year)
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))
			d3.select('#plotsubtitle')
				.text(curCrime)
			
			d3.select('#maptitle')
				.text(curCrime+', 201'+year)
		})

	d3.select('#home')
		.on('click', function(){
			curProvince = 'Nederland'
			curCrime ='totaal'
			makePie(dataPie(data, curCrime, year))
			makePlot(plotData(data, curCrime))

			d3.selectAll('.land')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null)

			d3.select('#maptitle')
				.text(curCrime+', 201'+year)
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3))
			d3.select('#plotsubtitle')
				.text(curCrime)
			d3.select('#pietitle')
				.text(curProvince+', '+curCrime+', 201'+year)
		})
	}
