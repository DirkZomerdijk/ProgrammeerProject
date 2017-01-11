d3.csv("misdrijfData.csv", function(data){

	var dataByName = d3.nest()
  		.key(function(d) { return d.misdrijf; })
  		.entries(data);

  		console.log(dataByName)

  	var complete = {};	
  	dataByName.forEach(function(d, i){
  		complete[d.misdrijf] = d.values
  	})	

  	console.log(complete)

  	
})





