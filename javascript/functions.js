/**
 * Dirk Zomerdijk
 * 10530274
 * Bèta-gamma
 * Crime explorer
 * Functions javascript
 */

/**
 * Draws Piechart
 * @param {Object} data
 */
function makePie(data) {
	// Remove current piechart
	d3.select('#pie').remove()

	// Get pie container append svg
	pieChart = d3.select('#pieContainer')
	  	.append("svg")
			.attr("id", "pie")
		    .attr("width", 600)
		    .attr("height", 600)
	  	  .append("g")
	    		.attr("transform", "translate(" + pieWidth  + "," + pieHeight*1.3 + ")");

	// Set pie values
	var pie = d3.layout.pie()
	    .value(function(d) { return d.count});

	// Append pie arcs
	var g = pieChart.selectAll(".arc")
		.data(pie(data))
	  .enter().append("g")
		.attr("class", "arc");

	// Append paths, set class and id, and fill with color
	g.append("path")
		.attr("class", selPieClass(data))
		.attr("id", function(d){ return d.data.label})
		  	.attr("d", arc)
	  	.style("fill", function(d) { return color(d.data.label); });

};

/**
 * selects class label for pie
 * @param {Object} data
 * @return {String} label
 */
function selPieClass (data) {
	if (data.length == crimes.length-1 ) {
		return 'crime-label';
	}
	else {
		return 'province-label';
	};
};
/**
 * constructs dataset for pie
 * @param {Object} data 
 * @param {String} crime
 * @param {String} year
 * @return {Data} pieData
 */

function dataPie(data, crime, year) {
	// Intitiate data array
	var pieData = [];
	for (var i = 0; i < provinces.length; i++) {
		// Set current label and current count
		var curLabel = provinces[i];
		var curCount = data[provinces[i]][crime][year];

		// Make data entery
		var obj = {'label': curLabel, 'count': curCount};
		pieData.push(obj);


	};
	return pieData;
};

/**
 * constructs total dataset for Netherlands
 * @param {Object} data
 * @param {String} year
 * @return {Object} nedTotaalPie
 */
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

/**
 * Constructs province dataset for pie 
 * @param {Object}data 
 * @param {String} crime
 * @param {String} year
 * @return {Data} pieData
 */
function provincePie(data, province, year) {
	var pieData = [];
	for (var i = 0; i < crimes.length-1; i++) {
		var curLabel = crimes[i];
		var curCount = data[province][curLabel][year];
		var obj = {'label': curLabel, 'count': curCount};
		pieData.push(obj);

	};
	return pieData;
};

/**
 * constructs total dataset for Netherlands
 * @param {Object} data
 * @param {String} year
 * @return {Object} nedTotaalPie
 */
function totalPie(data, year) {
	var nedTotaalPie = [];
	var test = 0;
	for (var i = 0; i < provinces.length; i++) {

		var curLabel = provinces[i];
		var curCount = data[provinces[i]].totaal[year];
		var people = inwoners[provinces[i]];
		var multyplier = 100 - (people / inwoners['Nederland'] * 100);
		var obj = {'label': curLabel, 'count': curCount*multyplier};
		nedTotaalPie.push(obj);
	};
	return nedTotaalPie	;
}

/**
 * Draws plot, updates if already there.
 * @param {Object} data
 */
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

		// Update domain of plot
		x.domain(d3.extent(data, function (d) { return d.Year; })).nice();
		y.domain([0, d3.max(data, function (d) { return d.Value + d.Value/5; })]);

		// Set transition
		var change = d3.select("#plot").transition().duration(200);

		// Update x and y axis and line path
		change.select(".x.axis").call(xAxis);
		change.select(".y.axis").call(yAxis);
		change.select(".plotline").attr('d', valueline(data));
	}
	else {
		var valueline = d3.svg.line()
		    .x(function (d) { return x(d.Year);})
		    .y(function (d) { return y(d.Value);})
		    .interpolate("monotone");

		// Scale the range of the data
		x.domain(d3.extent(data, function (d) { return d.Year; }));
		y.domain([0, d3.max(data, function (d) { return d.Value + d.Value/5; })]);

		// Add the valueline path.
		plot.append("path") 
		.attr("d", valueline(data))
		.attr('class', 'plotline');

		// Add the X Axis
		plot.append("g") 
			.attr("class", "x axis")
		    .attr("transform", "translate(0," + plotHeight + ")")
		    .call(xAxis);

		// Add the Y Axis
		plot.append("g") 
			.attr("class", "y axis")
		    .call(yAxis);

		// First plot is made
		isPlot = true;
	};
};

/**
 * constructs dataset for plot (province)
 * @param {Object} data
 * @param {String} province
 * @param {String} crime
 * @return {Object} dataset
 */
function plotProvince(data, province, crime) {
	obj = data[province][crime]
	dataset = [
	{'Value': obj[0], 'Year':years[0]},	
	{'Value': obj[1], 'Year':years[1]},
	{'Value': obj[2], 'Year':years[2]},
	{'Value': obj[3], 'Year':years[3]}	
	];
	return dataset;
};

/**
 * constructs dataset for plot (Netherlands)
 * @param {Object} data
 * @param {String} province
 * @param {String} crime
 * @return {Object} dataset
 */
function plotTotal(data, province){
	var check = 0, data0 = 0, data1 = 0, data2 = 0, data3 = 0;
    for (var i = 0; i < crimes.length-1; i++) {
    	data0 += +data[province][crimes[i]]['0'];
    	data1 += +data[province][crimes[i]]['1'];
    	data2 += +data[province][crimes[i]]['2'];
    	data3 += +data[province][crimes[i]]['3'];
    };
    var totProvince = [
    	{'Value': data0, 'Year': years[0]},
    	{'Value': data1, 'Year': years[1]},
    	{'Value': data2, 'Year': years[2]},
    	{'Value': data3, 'Year': years[3]}
    ]; 
    data[province].totaal = totProvince;
	return totProvince;
}

/**
 * Fill each Province with color.
 * @param {Object} data
 * @param {String} crime
 * @param {String} province
 */
function fillMap(data, crime, year) {
	for (var i = 0; i < provinces.length; i++) {
		d3.select("[title=" + String(provinces[i]) + "]")
			.style('fill', calcFill(data, provinces[i],crime,year,calcTotal(data, curCrime)));

	};
};

/**
 * calculates total amount of specific crime in Netherlands
 * @param {Object} data
 * @param {String} crime
 * @return {Number} total
 */
function calcTotal(data, crime){
	var total = 0;
	for (var i = 0; i < provinces.length; i++) {
		total += +data[String(provinces[i])][crime][year];
	};
	return total;
};

/**
 * Calculates fill color
 * @param {Object} data
 * @param {String} province
 * @param {String} crime
 * @param {String} year
 * @param {Number} total
 * @return {String} colors[index]
 */
function calcFill(data, province, crime, year, total) {
	var index;
	var value = data[province][crime][year];
	var perc = value/total*100;

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
	};
	return String(colors[index]);
};

/**
 * Removes everything but characters from string
 * @param {String} string
 * @return {String} string
 */
function fuseString(string) {
	return string.replace(/[^a-zA-Z]/g,'');
}

/**
 * Shows dropdown menu with crimes
 */
function crimeFunction() {
    document.getElementById("crimeDrop").classList.toggle("show");
}

/**
 * Calculates percentage of crime
 * @param {Object} data
 * @param {String} province
 * @param {String} crime
 * @param {String} year
 * @return {String} '>1'
 * @return {Number} result
 */
function calcPerc(data, province, crime, year) {
	// Set variables for calculating percentage
	var result;
	var totalNed = nedTotaalPlot[year].Value;
	var totalProvince = data[province]['totaal'][year];
	var crimeProvince = data[province][crime][year];
	var crimeTotal = calcTotal(data, crime);

	// calculate percentages
	var percProvince = totalProvince / totalNed * 100;
	var percCrime = crimeProvince / totalProvince * 100;
	var percCrimeProvince = crimeProvince / crimeTotal * 100;

	// return right percentage
	if (curCrime == 'totaal' && curProvince == 'Nederland') {
		result = Math.round(percProvince);
	}
	else if (curCrime != 'totaal' && curProvince == 'Nederland') {
		result = Math.round(percCrimeProvince);
	}
	else {
		result = Math.round(percCrime);
	}

	if (result == 0){
		return '>1';
	}
	else {
		return result;
	};
};

/**
 * Stars all event listners
 * @param {Object} data
 */
function callListeners(data) {

	// Select all provinces
	d3.selectAll('.land')
		.on('mouseover', function(){
			// Set province mouse points to
			pointProvince = d3.select(this).attr('title');
			
			// Change style of province
			d3.select('#'+pointProvince)
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 2);

			// Calculate percentage for piechart
			if (curProvince == 'Nederland' || curCrime != 'totaal'){
				d3.select('#percentage')
					.text(calcPerc(data, pointProvince, curCrime, year)+'%');
			};

			// Update title
			d3.select("#plottitle")
				.text(d3.select('[title="'+pointProvince+'"]').attr('id').substring(3))	;	
		})
		.on('mouseout', function(){
			// Change style of province
			d3.select('#'+pointProvince)
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null);

			// Calculate percentage for piechart
			d3.select('#percentage')
				.text(function(){
					if (curCrime != 'totaal'){
						return calcPerc(data, curProvince, curCrime, year)+'%';
					}
					else{
						return '%';
					};
				});

			// Update title
			d3.select("#plottitle")
				.text(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));	
		})
		.on('click', function(){
			// set previous and current province
			preProvince = curProvince;
			curProvince = pointProvince;

			// Change style of current province
			d3.select('#map [title="'+curProvince+'"]')
				.style('opacity', 0.5)
				.style('stroke', 'steelblue')
				.style('stroke-width', 2);

			// Change style of previous province
			d3.select('#map [title="'+preProvince+'"]')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null);			

			// Update title
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));

			// Calculate percentage for piechart
			if (curProvince != 'Nederland'){
				d3.select('#percentage')
					.text(calcPerc(data, curProvince, curCrime, year)+'%');
			};					

			// Update pie and plot
			makePie(provincePie(data, curProvince, year));
			makePlot(plotProvince(data, curProvince, curCrime));
		});

	// select all piechart arcs representing provinces
	d3.selectAll('.province-label')
		.on('mouseover', function(){
			pointProvince = this.id;

			// Enlarge hoverd pie segment
			d3.select(this)
				.attr('d', arcHover);

			// Update datamap style	
			d3.select('#map [title="'+pointProvince+'"]')
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 2);

			// Calculate percentage for piechart
			if (curProvince == 'Nederland'){
				d3.select('#percentage')
					.text(calcPerc(data, pointProvince, curCrime, year)+'%');
			};	

			// Update title
			d3.select("#plottitle")
				.text(d3.select('[title="'+pointProvince+'"]').attr('id').substring(3));
		})
		.on('mouseout', function(){
			d3.select('#'+pointProvince)
				.attr('d', arc);

			// Update datamap style	
			d3.select('#map [title="'+pointProvince+'"]')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null);

			// Update title
			d3.select('#percentage')
				.text('%');
			d3.select("#plottitle")
				.text(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));		
		})
		.on('click', function(){
			curProvince = pointProvince;
			makePie(provincePie(data, curProvince, year));
			makePlot(plotProvince(data, curProvince, curCrime));

			// Update title
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));
			d3.select('#plotsubtitle')
				.text(curCrime);

			// Calculate percentage for piechart
			d3.select('#percentage')
				.text(function() {
					if (curCrime != 'totaal') {
						return calcPerc(data, curProvince, curCrime, year)+'%';
					};
				});	
		});


	d3.selectAll('.crime-label')
		.on('mouseover', function(){
			pointCrime = this.id;

			// Update pie segment style	
			d3.select(this)
				.style('opacity', 0.5)
				.style('stroke', 'grey')
				.style('stroke-width', 3)
				.attr('d', arcHover);

			// Calculate percentage for piechart
			d3.select('#percentage')
				.text(calcPerc(data, curProvince, pointCrime, year)+'%');

			// Update title
			d3.select('#plotsubtitle')
				.text(pointCrime);
		})
		.on('mouseout', function(){
			d3.select(this)
				.attr('d', arc);
			
			// Update pie segment style	
			d3.select(this)
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null);

			// Calculate percentage for piechart
			d3.select('#percentage')
				.text(function() {
					if (curCrime != 'totaal') {
						return calcPerc(data, curProvince, curCrime, year)+'%';
					};
				});
			
			// Update title
			d3.select('#plotsubtitle')
				.text(curCrime);
		})
		.on('click', function() {
			curCrime = this.id;

			// Update plot and map
			makePlot(plotProvince(data, curProvince, curCrime));
			fillMap(data, curCrime, year);

			// Update title
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));
			d3.select('#plotsubtitle')
				.text(curCrime);
		});

	d3.selectAll('.crimeDrop')
		.on('click', function(){
			curCrime = this.innerHTML;

			// Update map, plot and pie
			fillMap(data, curCrime, year);
			makePlot(plotData(data, curCrime));
			if (curProvince == 'Nederland') {
				makePie(dataPie(data, curCrime, year));
			} else {
				makePie(provincePie(data, curProvince, year));
			};

			// Update title
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));
			d3.select('#plotsubtitle')
				.text(curCrime);
		})

	d3.select('#home')
		.on('click', function(){
			curProvince = 'Nederland';
			curCrime ='totaal';

			// Update map, plot and pie
			makePie(dataPie(data, curCrime, year));
			makePlot(plotData(data, curCrime));
			fillMap(data, 'totaal', year);

			// Update datamap style	
			d3.selectAll('.land')
				.style('opacity', null)
				.style('stroke', null)
				.style('stroke-width', null);

			// Update title
			d3.select('#plottitle')
				.html(d3.select('[title="'+curProvince+'"]').attr('id').substring(3));
			d3.select('#plotsubtitle')
				.text(curCrime);


		});

	d3.select('#plot')
		.on('mouseover', function(){
			// Change style of line 
			d3.select('.plotline')
				.style('stroke','steelblue');

			// Show data for line
			d3.select('#plotvalues')
				.style('visibility', 'visible')
				.html(function(){
					var string = '';
					if (curProvince == 'Nederland') {
						string = 	'2010: '+nedTotaalPlot[0].Value+'<br>'+
									'2011: '+nedTotaalPlot[1].Value+'<br>'+
									'2012: '+nedTotaalPlot[2].Value+'<br>'+
									'2013: '+nedTotaalPlot[3].Value;
					}
					else {
						string = 	'2010: '+data[curProvince][curCrime][0]+'<br>'+
									'2011: '+data[curProvince][curCrime][1]+'<br>'+
									'2012: '+data[curProvince][curCrime][2]+'<br>'+
									'2013: '+data[curProvince][curCrime][3];
					};
					return string;
				});
		})
		.on('mouseout', function(){
			// Change color for line
			d3.select('.plotline')
				.style('stroke','lightblue');
				
			// Hide data for line
			d3.select('#plotvalues')
				.style('visibility', 'hidden');
		});
};
