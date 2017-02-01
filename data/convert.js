d3.csv("misdrijfData.csv", function(data){

  // console.log(data)

	var dataByRegion = d3.nest()
  		.key(function(d) { return d.Regio; })
  		.entries(data);

  console.log(dataByRegion)

	var complete = {};	
	dataByRegion.forEach(function(d){
		complete[d.misdrijf] = d.values
	})	

  	// console.log(complete)

  	
})





